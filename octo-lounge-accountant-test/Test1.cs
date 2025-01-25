using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using System.Linq;
using System.Collections.Generic;
using octo_lounge_accountant_api.Controllers;
using octo_lounge_accountant_api.Data;
using octo_lounge_accountant_api.Models;
using octo_lounge_accountant_api.ModelsDTO;

namespace octo_lounge_accountant_test
{
    [TestClass]
    public sealed class AccountsControllerTests
    {
        private SqliteConnection _connection;
        private DataContext _context;
        private AccountsController _controller;

        [TestInitialize]
        public void Setup()
        {
            // SQLite in-memory DB
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();

            var options = new DbContextOptionsBuilder<DataContext>()
                //.UseSqlite(_connection)
                .Options;

            _context = new DataContext(options);
            _context.Database.EnsureCreated();

            _controller = new AccountsController(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context?.Dispose();
            _connection?.Close();
            _connection?.Dispose();
        }

        [TestMethod]
        public void CreateAccount_WithPlusBehaviour_ReturnsOkAndPersistsAccount()
        {
            // Arrange: behaviour = '+'
            var accountDto = new AccountDTO
            {
                Name = "Kasse",
                Behaviour = '+',   // e.g., a cash account
                AccountType = 1,
                OwnerId = 42
            };

            // Act
            var result = _controller.CreateAccount(accountDto);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult, "Expected OkObjectResult.");

            var createdAccount = okResult.Value as Account;
            Assert.IsNotNull(createdAccount, "Expected an Account object in OkResult.");

            Assert.AreEqual("Kasse", createdAccount.Name);
            Assert.AreEqual('+', createdAccount.AccountBehaviour);
            Assert.AreEqual(1, createdAccount.AccountTypeId);
            Assert.AreEqual(42, createdAccount.OwnerId);
            Assert.AreEqual(0, createdAccount.AccountNumber,
                "Should default to 0 unless set in the controller.");

            // Confirm saved to DB
            var dbAccount = _context.Accounts.FirstOrDefault(a => a.Id == createdAccount.Id);
            Assert.IsNotNull(dbAccount, "Account should be found in the database.");
            Assert.AreEqual('+', dbAccount.AccountBehaviour);
        }

        [TestMethod]
        public void CreateAccount_WithMinusBehaviour_ReturnsOkAndPersistsAccount()
        {
            // Arrange: behaviour = '-'
            var accountDto = new AccountDTO
            {
                Name = "Verbindlichkeiten",
                Behaviour = '-',   // e.g., a liabilities account
                AccountType = 2,
                OwnerId = 99
            };

            // Act
            var result = _controller.CreateAccount(accountDto);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var createdAccount = okResult.Value as Account;
            Assert.IsNotNull(createdAccount);

            Assert.AreEqual("Verbindlichkeiten", createdAccount.Name);
            Assert.AreEqual('-', createdAccount.AccountBehaviour);
            Assert.AreEqual(2, createdAccount.AccountTypeId);
            Assert.AreEqual(99, createdAccount.OwnerId);

            var dbAccount = _context.Accounts.FirstOrDefault(a => a.Id == createdAccount.Id);
            Assert.IsNotNull(dbAccount);
            Assert.AreEqual('-', dbAccount.AccountBehaviour);
        }

        [TestMethod]
        public void CreateAccount_NullDto_ReturnsBadRequest()
        {
            // Act
            var result = _controller.CreateAccount(null);

            // Assert
            var badRequest = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequest);
            Assert.AreEqual("Account data is null.", badRequest.Value);
        }

        [TestMethod]
        public void DeleteAccount_ValidId_DeletesAccount()
        {
            // Arrange: create and save an account
            var account = new Account
            {
                Name = "To Be Deleted",
                AccountBehaviour = '+',
                AccountTypeId = 1,
                OwnerId = 1
            };
            _context.Accounts.Add(account);
            _context.SaveChanges();

            // Act
            var result = _controller.DeleteAccount(account.Id);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual("Account deleted successfully.", okResult.Value);

            var check = _context.Accounts.Find(account.Id);
            Assert.IsNull(check, "Account should be deleted from the DB.");
        }

        [TestMethod]
        public void DeleteAccount_InvalidId_ReturnsNotFound()
        {
            // Act
            var result = _controller.DeleteAccount(9999);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual("Account not found.", notFoundResult.Value);
        }

        [TestMethod]
        public void EditAccount_ValidId_UpdatesAccount()
        {
            // Arrange
            var existing = new Account
            {
                Name = "Altes Konto",
                AccountBehaviour = '+',
                AccountTypeId = 10,
                OwnerId = 123,
                AccountNumber = 555
            };
            _context.Accounts.Add(existing);
            _context.SaveChanges();

            var dto = new AccountDTO
            {
                Name = "Neues Konto",
                Behaviour = '-',
                AccountType = 9,
                OwnerId = 999
            };

            // Act
            var result = _controller.EditAccount(existing.Id, dto);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var updatedAccount = okResult.Value as Account;
            Assert.IsNotNull(updatedAccount);
            Assert.AreEqual("Neues Konto", updatedAccount.Name);
            Assert.AreEqual('-', updatedAccount.AccountBehaviour);
            Assert.AreEqual(9, updatedAccount.AccountTypeId);
            Assert.AreEqual(999, updatedAccount.OwnerId);

            // Check in DB
            var dbAccount = _context.Accounts.Find(existing.Id);
            Assert.IsNotNull(dbAccount);
            Assert.AreEqual("Neues Konto", dbAccount.Name);
            Assert.AreEqual('-', dbAccount.AccountBehaviour);
            Assert.AreEqual(9, dbAccount.AccountTypeId);
            Assert.AreEqual(999, dbAccount.OwnerId);
            // Confirm that AccountNumber was NOT changed (controller doesn't do that)
            Assert.AreEqual(555, dbAccount.AccountNumber);
        }

        [TestMethod]
        public void EditAccount_InvalidId_ReturnsNotFound()
        {
            var dto = new AccountDTO
            {
                Name = "Bad Edit",
                Behaviour = '-',
                AccountType = 2,
                OwnerId = 42
            };

            var result = _controller.EditAccount(9999, dto);

            var notFound = result as NotFoundObjectResult;
            Assert.IsNotNull(notFound);
            Assert.AreEqual("Account not found.", notFound.Value);
        }

        [TestMethod]
        public void GetAccountsByOwner_ValidOwner_ReturnsOk()
        {
            // Arrange
            var account1 = new Account
            {
                Name = "Bank",
                AccountBehaviour = '+',
                AccountTypeId = 3,
                OwnerId = 100
            };
            var account2 = new Account
            {
                Name = "Fahrzeuge",
                AccountBehaviour = '-',
                AccountTypeId = 4,
                OwnerId = 100
            };
            var account3 = new Account
            {
                Name = "Something Else",
                AccountBehaviour = '+',
                AccountTypeId = 2,
                OwnerId = 101
            };
            _context.Accounts.AddRange(account1, account2, account3);
            _context.SaveChanges();

            // Act: Query for OwnerId=100
            var result = _controller.GetAccountsByOwner(100);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var accounts = okResult.Value as List<Account>;
            Assert.IsNotNull(accounts);
            Assert.AreEqual(2, accounts.Count, "Should return 2 accounts for Owner=100.");
            Assert.IsTrue(accounts.Any(a => a.Name == "Bank"));
            Assert.IsTrue(accounts.Any(a => a.Name == "Fahrzeuge"));
        }

        [TestMethod]
        public void GetAccountsByOwner_InvalidOwner_ReturnsNotFound()
        {
            var result = _controller.GetAccountsByOwner(9999);
            var notFound = result as NotFoundObjectResult;
            Assert.IsNotNull(notFound);
            Assert.AreEqual("No accounts found for the specified owner.", notFound.Value);
        }

        [TestMethod]
        public void GetAllAccountsAndStatements_ValidOwner_ReturnsOkWithData()
        {
            // Arrange
            var ownerId = 77;
            var account = new Account
            {
                Name = "Kasse",
                AccountBehaviour = '+',
                AccountTypeId = 1,
                OwnerId = ownerId
            };
            _context.Accounts.Add(account);
            _context.SaveChanges();

            // Suppose we have a single record for that account
            var record = new Record
            {
                Date = System.DateTime.Now,
                Amount = 100.50m,
                Description = "Einnahme",
                CreditorId = account.Id,
                DebitorId = 200
            };
            _context.Records.Add(record);
            _context.SaveChanges();

            // Act
            var result = _controller.GetAllAccountsAndStatements(ownerId);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var data = okResult.Value as List<RecordInAccountDTO>;
            Assert.IsNotNull(data);
            Assert.AreEqual(1, data.Count,
                "Should return exactly one account for that owner.");

            var accountWithRecords = data.First();
            Assert.AreEqual("Kasse", accountWithRecords.AccountName);
            Assert.AreEqual('+', accountWithRecords.AccountBehaviour);
            Assert.AreEqual(1, accountWithRecords.AccountTypeId);
            Assert.AreEqual(ownerId, accountWithRecords.OwnerId);
            Assert.AreEqual(1, accountWithRecords.Records.Count);

            var rec = accountWithRecords.Records.First();
            Assert.AreEqual(100.50m, rec.Amount);
            Assert.AreEqual("Einnahme", rec.Description);
            Assert.AreEqual(account.Id, rec.CreditorId);
            Assert.AreEqual(200, rec.DebitorId);
        }

        [TestMethod]
        public void GetAllAccountsAndStatements_InvalidOwner_ReturnsNotFound()
        {
            var result = _controller.GetAllAccountsAndStatements(9999);
            var notFound = result as NotFoundObjectResult;
            Assert.IsNotNull(notFound);
            Assert.AreEqual("No accounts found for the specified owner.", notFound.Value);
        }
    }
}
