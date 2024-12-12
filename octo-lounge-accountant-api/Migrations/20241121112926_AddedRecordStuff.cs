using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace octo_lounge_accountant_api.Migrations
{
    /// <inheritdoc />
    public partial class AddedRecordStuff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Records_Accounts_DebtorId",
                table: "Records");

            migrationBuilder.RenameColumn(
                name: "DebtorId",
                table: "Records",
                newName: "DebitorId");

            migrationBuilder.RenameIndex(
                name: "IX_Records_DebtorId",
                table: "Records",
                newName: "IX_Records_DebitorId");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "Records",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_Records_Accounts_DebitorId",
                table: "Records",
                column: "DebitorId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Records_Accounts_DebitorId",
                table: "Records");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "Records");

            migrationBuilder.RenameColumn(
                name: "DebitorId",
                table: "Records",
                newName: "DebtorId");

            migrationBuilder.RenameIndex(
                name: "IX_Records_DebitorId",
                table: "Records",
                newName: "IX_Records_DebtorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Records_Accounts_DebtorId",
                table: "Records",
                column: "DebtorId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
