using Microsoft.EntityFrameworkCore;
using octo_lounge_accountant_api.Models;

namespace octo_lounge_accountant_api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Record> Records { get; set; }
        public DbSet<AccountType> AccountTypes { get; set; } // Add DbSet for AccountType

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Record>()
                .HasOne(r => r.Creditor)
                .WithMany()
                .HasForeignKey(r => r.CreditorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Record>()
                .HasOne(r => r.Debitor)
                .WithMany()
                .HasForeignKey(r => r.DebitorId)
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
            modelBuilder.Entity<Record>()
                .Property(r => r.Amount)
                .HasColumnType("decimal(18,2)");
        }
    }
}
