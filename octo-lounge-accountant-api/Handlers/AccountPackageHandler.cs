using octo_lounge_accountant_api.Models;

namespace octo_lounge_accountant_api.Handlers
{
    public class AccountPackageHandler
    {
        public List<Account> CreateStandardAccountPackageLimitedCompany(int profileId)
        {
            return new List<Account>
            {
                // Class 1: Assets
                new Account { Name = "Cash", AccountBehaviour = '+', AccountNumber = 1000, OwnerId = profileId },
                new Account { Name = "Post Account", AccountBehaviour = '+', AccountNumber = 1020, OwnerId = profileId },
                new Account { Name = "Bank Balance", AccountBehaviour = '+', AccountNumber = 1021, OwnerId = profileId },
                new Account { Name = "Accounts Receivable", AccountBehaviour = '+', AccountNumber = 1100, OwnerId = profileId },
                new Account { Name = "VAT Credit Material, Goods, Services", AccountBehaviour = '+', AccountNumber = 1170, OwnerId = profileId },
                new Account { Name = "Inventory Merchandise", AccountBehaviour = '+', AccountNumber = 1200, OwnerId = profileId },
                new Account { Name = "Prepaid Expenses", AccountBehaviour = '+', AccountNumber = 1300, OwnerId = profileId },

                // Fixed Assets
                new Account { Name = "Machinery", AccountBehaviour = '+', AccountNumber = 1500, OwnerId = profileId },
                new Account { Name = "Furniture and Fixtures", AccountBehaviour = '+', AccountNumber = 1510, OwnerId = profileId },
                new Account { Name = "Vehicles", AccountBehaviour = '+', AccountNumber = 1530, OwnerId = profileId },
                new Account { Name = "Real Estate", AccountBehaviour = '+', AccountNumber = 1600, OwnerId = profileId },
                new Account { Name = "Patents, Licenses", AccountBehaviour = '+', AccountNumber = 1700, OwnerId = profileId },

                // Class 2: Liabilities
                new Account { Name = "Accounts Payable", AccountBehaviour = '-', AccountNumber = 2000, OwnerId = profileId },
                new Account { Name = "VAT Liability", AccountBehaviour = '-', AccountNumber = 2200, OwnerId = profileId },
                new Account { Name = "Social Security Liabilities", AccountBehaviour = '-', AccountNumber = 2270, OwnerId = profileId },
                new Account { Name = "Accrued Liabilities", AccountBehaviour = '-', AccountNumber = 2300, OwnerId = profileId },
                new Account { Name = "Short-Term Provisions", AccountBehaviour = '-', AccountNumber = 2330, OwnerId = profileId },

                // Long-Term Liabilities
                new Account { Name = "Mortgages", AccountBehaviour = '-', AccountNumber = 2401, OwnerId = profileId },
                new Account { Name = "Long-Term Loan", AccountBehaviour = '-', AccountNumber = 2450, OwnerId = profileId },
                new Account { Name = "Long-Term Provisions", AccountBehaviour = '-', AccountNumber = 2600, OwnerId = profileId },

                // Equity (AG)
                new Account { Name = "Capital Stock (AG)", AccountBehaviour = '-', AccountNumber = 2800, OwnerId = profileId },
                new Account { Name = "Legal Capital Reserve", AccountBehaviour = '-', AccountNumber = 2900, OwnerId = profileId },
                new Account { Name = "Legal Retained Earnings", AccountBehaviour = '-', AccountNumber = 2950, OwnerId = profileId },
                new Account { Name = "Voluntary Retained Earnings", AccountBehaviour = '-', AccountNumber = 2960, OwnerId = profileId },
                new Account { Name = "Profit or Loss Carried Forward", AccountBehaviour = '-', AccountNumber = 2970, OwnerId = profileId },
                new Account { Name = "Annual Profit or Loss", AccountBehaviour = '+', AccountNumber = 2979, OwnerId = profileId },

                // Class 3: Operating Revenue
                new Account { Name = "Merchandise Revenue", AccountBehaviour = '+', AccountNumber = 3200, OwnerId = profileId },
                new Account { Name = "Service Revenue", AccountBehaviour = '+', AccountNumber = 3400, OwnerId = profileId },
                new Account { Name = "Other Revenue", AccountBehaviour = '+', AccountNumber = 3600, OwnerId = profileId },
                new Account { Name = "Losses on Receivables", AccountBehaviour = '-', AccountNumber = 3805, OwnerId = profileId },

                // Class 4: Cost of Goods Sold
                new Account { Name = "Material Expenses", AccountBehaviour = '-', AccountNumber = 4000, OwnerId = profileId },
                new Account { Name = "Merchandise Expenses", AccountBehaviour = '-', AccountNumber = 4200, OwnerId = profileId },

                // Class 5: Personnel Expenses
                new Account { Name = "Wages", AccountBehaviour = '-', AccountNumber = 5000, OwnerId = profileId },
                new Account { Name = "Social Security Expenses", AccountBehaviour = '-', AccountNumber = 5700, OwnerId = profileId },
                new Account { Name = "Other Personnel Expenses", AccountBehaviour = '-', AccountNumber = 5800, OwnerId = profileId },

                // Class 6: Other Operating Expenses, Depreciation, Financial Results
                new Account { Name = "Rent Expenses", AccountBehaviour = '-', AccountNumber = 6000, OwnerId = profileId },
                new Account { Name = "Maintenance and Repairs", AccountBehaviour = '-', AccountNumber = 6100, OwnerId = profileId },
                new Account { Name = "Vehicle Expenses", AccountBehaviour = '-', AccountNumber = 6200, OwnerId = profileId },
                new Account { Name = "Insurance Expenses", AccountBehaviour = '-', AccountNumber = 6300, OwnerId = profileId },
                new Account { Name = "Administrative Expenses", AccountBehaviour = '-', AccountNumber = 6500, OwnerId = profileId },
                new Account { Name = "Advertising Expenses", AccountBehaviour = '-', AccountNumber = 6600, OwnerId = profileId },
                new Account { Name = "Depreciation", AccountBehaviour = '-', AccountNumber = 6800, OwnerId = profileId },
                new Account { Name = "Financial Expenses", AccountBehaviour = '-', AccountNumber = 6900, OwnerId = profileId },
                new Account { Name = "Financial Income", AccountBehaviour = '+', AccountNumber = 6950, OwnerId = profileId },

                // Closing Accounts
                new Account { Name = "Income Statement", AccountBehaviour = '-', AccountNumber = 9000, OwnerId = profileId },
                new Account { Name = "Balance Sheet", AccountBehaviour = '+', AccountNumber = 9100, OwnerId = profileId }
            };
        }
        public List<Account> CreateStandardAccountPackageForGmbH(int profileId)
        {
            return new List<Account>
                {
                // Class 1: Assets
                new Account { Name = "Cash", AccountBehaviour = '+', AccountNumber = 1000, OwnerId = profileId },
                new Account { Name = "Post Account", AccountBehaviour = '+', AccountNumber = 1020, OwnerId = profileId },
                new Account { Name = "Bank Balance", AccountBehaviour = '+', AccountNumber = 1021, OwnerId = profileId },
                new Account { Name = "Accounts Receivable", AccountBehaviour = '+', AccountNumber = 1100, OwnerId = profileId },
                new Account { Name = "VAT Credit Material, Goods, Services", AccountBehaviour = '+', AccountNumber = 1170, OwnerId = profileId },
                new Account { Name = "Inventory Merchandise", AccountBehaviour = '+', AccountNumber = 1200, OwnerId = profileId },
                new Account { Name = "Prepaid Expenses", AccountBehaviour = '+', AccountNumber = 1300, OwnerId = profileId },

                // Fixed Assets
                new Account { Name = "Machinery", AccountBehaviour = '+', AccountNumber = 1500, OwnerId = profileId },
                new Account { Name = "Furniture and Fixtures", AccountBehaviour = '+', AccountNumber = 1510, OwnerId = profileId },
                new Account { Name = "Vehicles", AccountBehaviour = '+', AccountNumber = 1530, OwnerId = profileId },
                new Account { Name = "Real Estate", AccountBehaviour = '+', AccountNumber = 1600, OwnerId = profileId },
                new Account { Name = "Patents, Licenses", AccountBehaviour = '+', AccountNumber = 1700, OwnerId = profileId },

                // Class 2: Liabilities
                new Account { Name = "Accounts Payable", AccountBehaviour = '-', AccountNumber = 2000, OwnerId = profileId },
                new Account { Name = "VAT Liability", AccountBehaviour = '-', AccountNumber = 2200, OwnerId = profileId },
                new Account { Name = "Social Security Liabilities", AccountBehaviour = '-', AccountNumber = 2270, OwnerId = profileId },
                new Account { Name = "Accrued Liabilities", AccountBehaviour = '-', AccountNumber = 2300, OwnerId = profileId },
                new Account { Name = "Short-Term Provisions", AccountBehaviour = '-', AccountNumber = 2330, OwnerId = profileId },

                // Long-Term Liabilities
                new Account { Name = "Mortgages", AccountBehaviour = '-', AccountNumber = 2401, OwnerId = profileId },
                new Account { Name = "Long-Term Loan", AccountBehaviour = '-', AccountNumber = 2450, OwnerId = profileId },
                new Account { Name = "Long-Term Provisions", AccountBehaviour = '-', AccountNumber = 2600, OwnerId = profileId },

                // Equity (GmbH)
                new Account { Name = "Capital Stock (GmbH)", AccountBehaviour = '-', AccountNumber = 2800, OwnerId = profileId },
                new Account { Name = "Legal Capital Reserve", AccountBehaviour = '-', AccountNumber = 2900, OwnerId = profileId },
                new Account { Name = "Legal Retained Earnings", AccountBehaviour = '-', AccountNumber = 2950, OwnerId = profileId },
                new Account { Name = "Voluntary Retained Earnings", AccountBehaviour = '-', AccountNumber = 2960, OwnerId = profileId },
                new Account { Name = "Profit or Loss Carried Forward", AccountBehaviour = '-', AccountNumber = 2970, OwnerId = profileId },
                new Account { Name = "Annual Profit or Loss", AccountBehaviour = '+', AccountNumber = 2979, OwnerId = profileId },

                // Class 3: Operating Revenue
                new Account { Name = "Merchandise Revenue", AccountBehaviour = '+', AccountNumber = 3200, OwnerId = profileId },
                new Account { Name = "Service Revenue", AccountBehaviour = '+', AccountNumber = 3400, OwnerId = profileId },
                new Account { Name = "Other Revenue", AccountBehaviour = '+', AccountNumber = 3600, OwnerId = profileId },
                new Account { Name = "Losses on Receivables", AccountBehaviour = '-', AccountNumber = 3805, OwnerId = profileId },

                // Class 4: Cost of Goods Sold
                new Account { Name = "Material Expenses", AccountBehaviour = '-', AccountNumber = 4000, OwnerId = profileId },
                new Account { Name = "Merchandise Expenses", AccountBehaviour = '-', AccountNumber = 4200, OwnerId = profileId },

                // Class 5: Personnel Expenses
                new Account { Name = "Wages", AccountBehaviour = '-', AccountNumber = 5000, OwnerId = profileId },
                new Account { Name = "Social Security Expenses", AccountBehaviour = '-', AccountNumber = 5700, OwnerId = profileId },
                new Account { Name = "Other Personnel Expenses", AccountBehaviour = '-', AccountNumber = 5800, OwnerId = profileId },

                // Class 6: Other Operating Expenses, Depreciation, Financial Results
                new Account { Name = "Rent Expenses", AccountBehaviour = '-', AccountNumber = 6000, OwnerId = profileId },
                new Account { Name = "Maintenance and Repairs", AccountBehaviour = '-', AccountNumber = 6100, OwnerId = profileId },
                new Account { Name = "Vehicle Expenses", AccountBehaviour = '-', AccountNumber = 6200, OwnerId = profileId },
                new Account { Name = "Insurance Expenses", AccountBehaviour = '-', AccountNumber = 6300, OwnerId = profileId },
                new Account { Name = "Administrative Expenses", AccountBehaviour = '-', AccountNumber = 6500, OwnerId = profileId },
                new Account { Name = "Advertising Expenses", AccountBehaviour = '-', AccountNumber = 6600, OwnerId = profileId },
                new Account { Name = "Depreciation", AccountBehaviour = '-', AccountNumber = 6800, OwnerId = profileId },
                new Account { Name = "Financial Expenses", AccountBehaviour = '-', AccountNumber = 6900, OwnerId = profileId },
                new Account { Name = "Financial Income", AccountBehaviour = '+', AccountNumber = 6950, OwnerId = profileId },

                // Closing Accounts
                new Account { Name = "Income Statement", AccountBehaviour = '-', AccountNumber = 9000, OwnerId = profileId },
                new Account { Name = "Balance Sheet", AccountBehaviour = '+', AccountNumber = 9100, OwnerId = profileId }
                };
        }

        public List<Account> CreateStandardAccountPackageForSole(int profileId)
        {
            return new List<Account>
            {
            // Class 1: Assets
            new Account { Name = "Cash", AccountBehaviour = '+', AccountNumber = 1000, OwnerId = profileId },
            new Account { Name = "Post Account", AccountBehaviour = '+', AccountNumber = 1020, OwnerId = profileId },
            new Account { Name = "Bank Balance", AccountBehaviour = '+', AccountNumber = 1021, OwnerId = profileId },
            new Account { Name = "Accounts Receivable", AccountBehaviour = '+', AccountNumber = 1100, OwnerId = profileId },
            new Account { Name = "VAT Credit Material, Goods, Services", AccountBehaviour = '+', AccountNumber = 1170, OwnerId = profileId },
            new Account { Name = "Inventory Merchandise", AccountBehaviour = '+', AccountNumber = 1200, OwnerId = profileId },
            new Account { Name = "Prepaid Expenses", AccountBehaviour = '+', AccountNumber = 1300, OwnerId = profileId },

            // Fixed Assets
            new Account { Name = "Machinery", AccountBehaviour = '+', AccountNumber = 1500, OwnerId = profileId },
            new Account { Name = "Furniture and Fixtures", AccountBehaviour = '+', AccountNumber = 1510, OwnerId = profileId },
            new Account { Name = "Vehicles", AccountBehaviour = '+', AccountNumber = 1530, OwnerId = profileId },
            new Account { Name = "Real Estate", AccountBehaviour = '+', AccountNumber = 1600, OwnerId = profileId },
            new Account { Name = "Patents, Licenses", AccountBehaviour = '+', AccountNumber = 1700, OwnerId = profileId },

            // Class 2: Liabilities
            new Account { Name = "Accounts Payable", AccountBehaviour = '-', AccountNumber = 2000, OwnerId = profileId },
            new Account { Name = "VAT Liability", AccountBehaviour = '-', AccountNumber = 2200, OwnerId = profileId },
            new Account { Name = "Social Security Liabilities", AccountBehaviour = '-', AccountNumber = 2270, OwnerId = profileId },
            new Account { Name = "Accrued Liabilities", AccountBehaviour = '-', AccountNumber = 2300, OwnerId = profileId },
            new Account { Name = "Long-Term Loan", AccountBehaviour = '-', AccountNumber = 2450, OwnerId = profileId },
            new Account { Name = "Long-Term Provisions", AccountBehaviour = '-', AccountNumber = 2600, OwnerId = profileId },

            // Equity
            new Account { Name = "Equity", AccountBehaviour = '-', AccountNumber = 2800, OwnerId = profileId },
            new Account { Name = "Private Withdrawals", AccountBehaviour = '-', AccountNumber = 2850, OwnerId = profileId },
            new Account { Name = "Annual Profit or Loss", AccountBehaviour = '+', AccountNumber = 2891, OwnerId = profileId },

            // Class 3: Operating Revenue
            new Account { Name = "Merchandise Revenue", AccountBehaviour = '+', AccountNumber = 3200, OwnerId = profileId },
            new Account { Name = "Service Revenue", AccountBehaviour = '+', AccountNumber = 3400, OwnerId = profileId },
            new Account { Name = "Other Revenue", AccountBehaviour = '+', AccountNumber = 3600, OwnerId = profileId },
            new Account { Name = "Losses on Receivables", AccountBehaviour = '-', AccountNumber = 3805, OwnerId = profileId },

            // Class 4: Cost of Goods Sold
            new Account { Name = "Material Expenses", AccountBehaviour = '-', AccountNumber = 4000, OwnerId = profileId },
            new Account { Name = "Merchandise Expenses", AccountBehaviour = '-', AccountNumber = 4200, OwnerId = profileId },

            // Class 5: Personnel Expenses
            new Account { Name = "Wages", AccountBehaviour = '-', AccountNumber = 5000, OwnerId = profileId },
            new Account { Name = "Social Security Expenses", AccountBehaviour = '-', AccountNumber = 5700, OwnerId = profileId },
            new Account { Name = "Other Personnel Expenses", AccountBehaviour = '-', AccountNumber = 5800, OwnerId = profileId },

            // Class 6: Other Operating Expenses, Depreciation, Financial Results
            new Account { Name = "Rent Expenses", AccountBehaviour = '-', AccountNumber = 6000, OwnerId = profileId },
            new Account { Name = "Maintenance and Repairs", AccountBehaviour = '-', AccountNumber = 6100, OwnerId = profileId },
            new Account { Name = "Vehicle Expenses", AccountBehaviour = '-', AccountNumber = 6200, OwnerId = profileId },
            new Account { Name = "Insurance Expenses", AccountBehaviour = '-', AccountNumber = 6300, OwnerId = profileId },
            new Account { Name = "Administrative Expenses", AccountBehaviour = '-', AccountNumber = 6500, OwnerId = profileId },
            new Account { Name = "Advertising Expenses", AccountBehaviour = '-', AccountNumber = 6600, OwnerId = profileId },
            new Account { Name = "Depreciation", AccountBehaviour = '-', AccountNumber = 6800, OwnerId = profileId },
            new Account { Name = "Financial Expenses", AccountBehaviour = '-', AccountNumber = 6900, OwnerId = profileId },
            new Account { Name = "Financial Income", AccountBehaviour = '+', AccountNumber = 6950, OwnerId = profileId },

            // Closing Accounts
            new Account { Name = "Income Statement", AccountBehaviour = '-', AccountNumber = 9000, OwnerId = profileId },
            new Account { Name = "Balance Sheet", AccountBehaviour = '+', AccountNumber = 9100, OwnerId = profileId }
            };
        }
    }
}
