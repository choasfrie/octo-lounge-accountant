using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace octo_lounge_accountant_api.Migrations
{
    /// <inheritdoc />
    public partial class fuckingworkalready : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Records_Accounts_CreditorId",
                table: "Records");

            migrationBuilder.DropForeignKey(
                name: "FK_Records_Accounts_DebitorId",
                table: "Records");

            migrationBuilder.AddForeignKey(
                name: "FK_Records_Accounts_CreditorId",
                table: "Records",
                column: "CreditorId",
                principalTable: "Accounts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Records_Accounts_DebitorId",
                table: "Records",
                column: "DebitorId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Records_Accounts_CreditorId",
                table: "Records");

            migrationBuilder.DropForeignKey(
                name: "FK_Records_Accounts_DebitorId",
                table: "Records");

            migrationBuilder.AddForeignKey(
                name: "FK_Records_Accounts_CreditorId",
                table: "Records",
                column: "CreditorId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Records_Accounts_DebitorId",
                table: "Records",
                column: "DebitorId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
