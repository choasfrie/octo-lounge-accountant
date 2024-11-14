using Microsoft.EntityFrameworkCore;
using octo_lounge_accountant_api.Models;

namespace octo_lounge_accountant_api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Records> Records { get; set; }
        public DbSet<AccountType> AccountTypes { get; set; } // Add DbSet for AccountType

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Records>()
                .HasOne(r => r.Creditor)
                .WithMany()
                .HasForeignKey(r => r.CreditorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Records>()
                .HasOne(r => r.Debtor)
                .WithMany()
                .HasForeignKey(r => r.DebtorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Account>()
                .HasOne(a => a.Owner)
                .WithMany()
                .HasForeignKey(a => a.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Account>()
                .HasOne(a => a.AccountType)
                .WithMany()
                .HasForeignKey(a => a.AccountTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Specify precision and scale for the Amount property
            modelBuilder.Entity<Records>()
                .Property(r => r.Amount)
                .HasColumnType("decimal(18,2)");
        }
    }
}
