# Projekt-Dokumentation

Burlet, Goedertier, Manser, Lucena

| Datum | Version | Zusammenfassung                                                                                                           |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
|       | 0.0.1   | We started working on plans such as the Database Model we've also initialized the ASP.Net Project and the front-end part. |
|       | ...     |                                                                                                                           |
|       | 1.0.0   |                                                                                                                           |

## 1 Informieren

### 1.1 Ihr Projekt

Octo-lounge-accountant is a browser application which is designed to support especially smaller businesses in accounting. We offer a baseplatform to create accounts and records. This is, to make it easy to track expenses and inspect the finances of the company. To increase the workflow there is an AI feature to add the Records. 

### 1.2 User Stories

| US-№ | Liability | Type       | Description                                                                                                                                                                           |
| ---- | --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Must      | Functional | As a user, I want to be able to register my Company                                                                                                                                   |
| 2    | Must      | Functional | As a user, I want to be able to login to the account.                                                                                                                                 |
| 3    | Must      | Quality    | As a user, I want to get a "standard account pack" when I create my account to have a base of accounts.                                                                               |
| 4    | Must      | Functional | As a user, I want to be able to create accounts                                                                                                                                       |
| 5    | Must      | Functional | As a user, I want to be able to edit the created accounts to my needs.                                                                                                                |
| 6    | Must      | Functional | As a user, I want to be able to delete accounts if they are not needed anymore and if there are entries with this account the I will be asked to change those entries or delete them. |
| 7    | Must      | Functional | As a user, I want to be able to create records.                                                                                                                                       |
| 8    | Must      | Functional | As a user, I want to be able to edit records.                                                                                                                                         |
| 9    | Must      | Functional | As a user, I want to be able to delete the records.                                                                                                                                   |
| 10   | Must      | Functional | As a user, I just want to be able to type the record as a text and the program will create an entry automatically.                                                                    |
| 11   | Must      | Functional | As a user, I want to be able to see the whole list of records.                                                                                                                        |
| 12   | Must      | Functional | As a user, I want to be able to filter the records to be able to analyse everything.                                                                                                  |
| 13   | Must      | Functional | As a user, I want to be able to support the devs by giving them money for the GPT requests.                                                                                           |
| 14   | Must      | Functional | As a user, I want to be able to see all my accounts on one page as a dashboard.                                                                                                       |
| 15   | Must      | Functional | As a user, I want to be able to graph my accounts.                                                                                                                                    |

### 1.3 Test cases

| TC-№     | Initial situation                                                     | Input                                                                           | Expected output                                                                                          |
| -------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **1.1**  | User is on the company registration page, no prior registration       | Enters valid company details and submits the form                               | Company is successfully registered; user receives a confirmation message and can proceed to log in       |
| **1.2**  | User is on the company registration page; company name already exists | Enters company details identical to an existing company and submits the form    | Error message indicating that the company already exists; registration is not completed                  |
| **1.3**  | User is on the company registration page                              | Leaves required fields empty or enters invalid data and submits the form        | Error messages indicating the required fields or invalid data; user is prompted to correct input         |
| **2.1**  | User is on the login page                                             | Enters valid username and password and clicks login                             | User is successfully logged in and redirected to the dashboard                                           |
| **2.2**  | User is on the login page                                             | Enters valid username and incorrect password and clicks login                   | Error message indicating incorrect password; user remains on the login page                              |
| **2.3**  | User is on the login page                                             | Enters non-existent username and any password and clicks login                  | Error message indicating username not found; user remains on the login page                              |
| **2.4**  | User is on the login page                                             | Leaves username and/or password fields empty and clicks login                   | Error message indicating that fields cannot be empty; user remains on the login page                     |
| **3.1**  | User has just registered a new company account                        | None (post-registration state)                                                  | User's account contains the standard account pack with predefined accounts visible in their account list |
| **4.1**  | User is logged in and navigates to the 'Create Account' page          | Enters valid account details and submits the form                               | Account is successfully created; account appears in the user's account list                              |
| **4.2**  | User is on the 'Create Account' page                                  | Leaves required fields empty or enters invalid data and submits the form        | Error messages indicating required fields or invalid data; account is not created                        |
| **4.3**  | User is on the 'Create Account' page; duplicate account name exists   | Enters duplicate account name and submits the form                              | Error message indicating that the account name already exists; account is not created                    |
| **5.1**  | User is logged in; account 'Cash' exists; navigates to edit page      | Changes account name to 'Petty Cash' and submits the form                       | Account is successfully updated; new name 'Petty Cash' appears in the account list                       |
| **5.2**  | User is on the edit account page for 'Cash'; 'Bank' account exists    | Changes account name to 'Bank' and submits the form                             | Error message indicating account name already exists; changes are not saved                              |
| **5.3**  | User is on the edit account page                                      | Enters invalid data or leaves required fields empty and submits the form        | Error messages indicating invalid data or required fields; changes are not saved                         |
| **6.1**  | User is logged in; 'Unused Account' has no records                    | Selects 'Delete' on 'Unused Account' and confirms deletion                      | Account is successfully deleted; it no longer appears in the account list                                |
| **6.2**  | 'Old Account' has associated records; user wants to delete it         | Selects 'Delete' on 'Old Account'; chooses to reassign entries to 'New Account' | Entries are reassigned to 'New Account'; 'Old Account' is deleted                                        |
| **6.3**  | 'Temporary Account' has associated records                            | Selects 'Delete'; chooses to delete associated entries                          | All associated entries are deleted; 'Temporary Account' is deleted                                       |
| **6.4**  | User initiates deletion of an account                                 | Cancels the deletion when prompted for confirmation                             | Account is not deleted; no changes occur                                                                 |
| **7.1**  | User is logged in; navigates to the 'Create Record' page              | Enters valid record details and submits the form                                | Record is successfully created; appears in the list of records                                           |
| **7.2**  | User is on the 'Create Record' page                                   | Leaves required fields empty and submits the form                               | Error messages indicating required fields; record is not created                                         |
| **7.3**  | User is on the 'Create Record' page                                   | Enters invalid data (e.g., negative amount) and submits the form                | Error messages indicating invalid data; record is not created                                            |
| **8.1**  | User has an existing record; navigates to the edit page               | Modifies record details with valid data and submits the form                    | Record is successfully updated; changes are reflected in the records list                                |
| **8.2**  | User is on the edit record page                                       | Enters invalid data and submits the form                                        | Error messages indicating invalid data; changes are not saved                                            |
| **8.3**  | User is on the edit record page                                       | Makes changes but cancels before saving                                         | Changes are discarded; record remains unchanged                                                          |
| **9.1**  | User is viewing the records list; 'Invoice #123' exists               | Selects 'Delete' on 'Invoice #123' and confirms deletion                        | Record is deleted; it no longer appears in the records list                                              |
| **9.2**  | User initiates deletion of a record                                   | Cancels the deletion when prompted for confirmation                             | Record is not deleted; remains in the records list                                                       |
| **10.1** | User is on the 'Quick Entry' page                                     | Types 'Paid $500 to supplier for office supplies on 2021-10-10' and submits     | System creates a record with date 2021-10-10, amount $500, and appropriate accounts assigned             |
| **10.2** | User is on the 'Quick Entry' page                                     | Types 'Received payment from client' and submits                                | System prompts for missing information (e.g., amount, date) or asks for clarification                    |
| **10.3** | User is on the 'Quick Entry' page                                     | Types invalid text 'asdasd123' and submits                                      | Error message indicating unable to parse input; record is not created                                    |
| **11.1** | User is logged in; records exist                                      | Navigates to the 'Records List' page                                            | All existing records are displayed, showing relevant details                                             |
| **11.2** | User is logged in; no records exist                                   | Navigates to the 'Records List' page                                            | Message displayed indicating no records found; option to create a new record                             |
| **12.1** | User is on the 'Records List' page with multiple records              | Applies date range filter from '2021-01-01' to '2021-12-31'                     | Records within the specified date range are displayed                                                    |
| **12.2** | User is on the 'Records List' page                                    | Applies filter for account 'Sales Revenue'                                      | Only records involving 'Sales Revenue' account are displayed                                             |
| **12.3** | User is on the 'Records List' page                                    | Filters records with amount greater than $1,000                                 | Records meeting the amount criteria are displayed                                                        |
| **12.4** | User applies multiple filters                                         | Filters by date range and account                                               | Records matching all applied criteria are displayed                                                      |
| **12.5** | User applies filter with criteria that match no records               | Filters by non-existent account or empty date range                             | Message displayed indicating no records found; empty list shown                                          |
| **13.1** | User is logged in; navigates to the 'Support Us' page                 | Enters valid payment details and amount; submits payment                        | Payment is processed successfully; confirmation message displayed; receipt is provided                   |
| **13.2** | User is on the 'Support Us' page                                      | Enters invalid payment details (e.g., expired card) and submits                 | Error message indicating payment failed due to invalid details; prompted to correct information          |
| **13.3** | User is on the 'Support Us' page                                      | Starts payment process but cancels before submission                            | Payment is not processed; user is returned to the 'Support Us' page or previous page                     |
| **14.1** | User is logged in; accounts exist                                     | Navigates to the 'Accounts Dashboard' page                                      | All accounts are displayed, showing balances and relevant information                                    |
| **14.2** | User is logged in; no accounts exist                                  | Navigates to the 'Accounts Dashboard' page                                      | Message indicating no accounts found; option to create a new account                                     |
| **15.1** | User is logged in; accounts have transaction history                  | Navigates to the 'Graphs' page; selects accounts to graph                       | Graphs are generated displaying account balances over time or other relevant metrics                     |
| **15.2** | User is logged in; accounts have no transaction history               | Tries to generate graphs                                                        | Message indicating insufficient data to generate graphs; prompted to add records                         |

### 1.4 Diagramme

✍️ Hier können Sie PAPs, Use Case- und Gantt-Diagramme oder Ähnliches einfügen.

## 2 Planen

| AP-№ | Deadline   | Responsible | Description                                                                                                         | Adjusted Planned Time |
| ---- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 1.A  | 07.11.2023 | Julius      | Backend:<br> Implement company registration functionality, including data validation and<br> storage (User Story 1) | 6 hours               |
| 1.B  | 07.11.2023 | Timo        | Frontend:<br> Develop registration form and connect it to the backend API (User Story 1)                            | 4 hours               |
| 1.C  | 07.11.2023 | Samuel      | UI/UX: Design<br> the registration page for optimal user experience (User Story 1)                                  | 3 hours               |
| 2.A  | 09.11.2023 | Julius      | Backend:<br> Implement login functionality with authentication and session management<br> (User Story 2)            | 6 hours               |
| 2.B  | 09.11.2023 | Timo        | Frontend:<br> Develop the login page and integrate with the backend (User Story 2)                                  | 4 hours               |
| 2.C  | 09.11.2023 | Samuel      | UI/UX: Design<br> the login interface for ease of use (User Story 2)                                                | 2 hours               |
| 3.A  | 10.11.2023 | Julius      | Backend:<br> Implement automatic assignment of "standard account pack" upon<br> account creation (User Story 3)     | 4 hours               |
| 4.A  | 12.11.2023 | Julius      | Backend:<br> Implement API endpoints for creating accounts (User Story 4)                                           | 4 hours               |
| 4.B  | 12.11.2023 | Timo        | Frontend:<br> Develop account creation form and connect it to the backend (User Story 4)                            | 4 hours               |
| 4.C  | 12.11.2023 | Samuel      | UI/UX: Design<br> the account creation interface for user friendliness (User Story 4)                               | 3 hours               |
| 5.A  | 13.11.2023 | Julius      | Backend:<br> Implement API endpoints for editing accounts (User Story 5)                                            | 4 hours               |
| 5.B  | 13.11.2023 | Timo        | Frontend:<br> Develop account editing interface and integrate with backend (User Story 5)                           | 4 hours               |
| 5.C  | 13.11.2023 | Samuel      | UI/UX: Design<br> the account editing interface for intuitive use (User Story 5)                                    | 3 hours               |
| 6.A  | 14.11.2023 | Julius      | Backend:<br> Implement account deletion with checks for existing entries (User Story 6)                             | 6 hours               |
| 6.B  | 14.11.2023 | Timo        | Frontend:<br> Develop account deletion interface and confirmation dialogs (User Story 6)                            | 4 hours               |
| 6.C  | 14.11.2023 | Samuel      | UI/UX: Design<br> the account deletion flow to prevent accidental deletions (User Story 6)                          | 3 hours               |
| 7.A  | 16.11.2023 | Julius      | Backend:<br> Implement API endpoints for creating records (User Story 7)                                            | 4 hours               |
| 7.B  | 16.11.2023 | Timo        | Frontend:<br> Develop record creation form and integrate with backend (User Story 7)                                | 4 hours               |
| 7.C  | 16.11.2023 | Samuel      | UI/UX: Design<br> the record creation interface for ease of data entry (User Story 7)                               | 3 hours               |
| 8.A  | 17.11.2023 | Julius      | Backend:<br> Implement API endpoints for editing records (User Story 8)                                             | 4 hours               |
| 8.B  | 17.11.2023 | Timo        | Frontend:<br> Develop record editing interface and integrate with backend (User Story 8)                            | 4 hours               |
| 8.C  | 17.11.2023 | Samuel      | UI/UX: Design<br> the record editing interface for consistency and usability (User Story 8)                         | 3 hours               |
| 9.A  | 18.11.2023 | Julius      | Backend:<br> Implement record deletion functionality (User Story 9)                                                 | 4 hours               |
| 9.B  | 18.11.2023 | Timo        | Frontend:<br> Develop record deletion interface and confirmation dialogs (User Story 9)                             | 4 hours               |
| 9.C  | 18.11.2023 | Samuel      | UI/UX: Design<br> the record deletion flow to prevent accidental data loss (User Story 9)                           | 3 hours               |
| 10.A | 20.11.2023 | Julius      | Backend:<br> Develop NLP service for parsing text into records (User Story 10)                                      | 8 hours               |
| 10.B | 20.11.2023 | Timo        | Frontend:<br> Develop interface for text input and display parsing results (User Story 10)                          | 5 hours               |
| 10.C | 20.11.2023 | Samuel      | UI/UX: Design<br> intuitive text input interface for automatic record creation (User Story 10)                      | 3 hours               |
| 10.D | 20.11.2023 | Alberto     | Assist Backend:<br> Help Julius integrate external AI APIs (e.g., GPT) securely (User Story 10)                     | 5 hours               |
| 11.A | 23.11.2023 | Julius      | Backend:<br> Implement API endpoints to retrieve the list of records (User Story 11)                                | 3 hours               |
| 11.B | 23.11.2023 | Timo        | Frontend:<br> Develop the records list page and integrate with backend (User Story 11)                              | 4 hours               |
| 11.C | 23.11.2023 | Samuel      | UI/UX: Design<br> the records list interface for readability and navigation (User Story 11)                         | 3 hours               |
| 12.A | 24.11.2023 | Julius      | Backend:<br> Implement filtering functionality in API for records (User Story 12)                                   | 4 hours               |
| 12.B | 24.11.2023 | Timo        | Frontend:<br> Develop filtering options in the records list page (User Story 12)                                    | 4 hours               |
| 12.C | 24.11.2023 | Samuel      | UI/UX: Design<br> the filtering interface for ease of use (User Story 12)                                           | 3 hours               |
| 13.A | 25.11.2023 | Julius      | Backend:<br> Implement payment processing integration for donations (User Story 13)                                 | 6 hours               |
| 13.B | 25.11.2023 | Timo        | Frontend:<br> Develop the donation/support page and integrate payment processing (User<br> Story 13)                | 4 hours               |
| 13.C | 25.11.2023 | Samuel      | UI/UX: Design<br> the donation page to encourage user support (User Story 13)                                       | 3 hours               |
| 14.A | 27.11.2023 | Julius      | Backend:<br> Implement API endpoints to retrieve account summaries for dashboard (User<br> Story 14)                | 4 hours               |
| 14.B | 27.11.2023 | Timo        | Frontend:<br> Develop the accounts dashboard page and integrate with backend (User Story<br> 14)                    | 4 hours               |
| 14.C | 27.11.2023 | Samuel      | UI/UX: Design<br> the accounts dashboard for clear presentation of account information (User<br> Story 14)          | 3 hours               |
| 15.A | 28.11.2023 | Julius      | Backend:<br> Prepare data endpoints for graphing account data (User Story 15)                                       | 4 hours               |
| 15.B | 28.11.2023 | Timo        | Frontend:<br> Implement graphing functionality using vis.js library (User Story 15)                             | 6 hours               |
| 15.C | 28.11.2023 | Samuel      | UI/UX: Design<br> graph layouts and interactions (User Story 15)                                                    | 3 hours               |
| 15.D | 28.11.2023 | Alberto     | Assist Frontend:<br> Help Timo with advanced graphing features and performance optimization (User<br> Story 15)     | 5 hours               |
| 16.A | 30.11.2023 | Alberto     | Testing:<br> Perform testing and bug fixing across the application (All User Stories)                               | 10 hours              |
| 16.B | 30.11.2023 | All         | Integration Testing: Final integration testing and deployment preparation                                           | 12 hours              |

## 3 Entscheiden

✍️ Dokumentieren Sie hier Ihre Entscheidungen und Annahmen, die Sie im Bezug auf Ihre User Stories und die Implementierung getroffen haben.

## 4 Realisieren

| AP-№ | Datum | Zuständig | geplante Zeit | tatsächliche Zeit |
| ---- | ----- | --------- | ------------- | ----------------- |
| 1.A  |       |           |               |                   |
| ...  |       |           |               |                   |

✍️ Tragen Sie jedes Mal, wenn Sie ein Arbeitspaket abschließen, hier ein, wie lang Sie effektiv dafür hatten.

## 5 Kontrollieren

### 5.1 Testprotokoll

| TC-№ | Datum | Resultat | Tester |
| ---- | ----- | -------- | ------ |
| 1.1  |       |          |        |
| ...  |       |          |        |

✍️ Vergessen Sie nicht, ein Fazit hinzuzufügen, welches das Test-Ergebnis einordnet.

### 5.2 Exploratives Testen

| BR-№ | Ausgangslage | Eingabe | Erwartete Ausgabe | Tatsächliche Ausgabe |
| ---- | ------------ | ------- | ----------------- | -------------------- |
| I    |              |         |                   |                      |
| ...  |              |         |                   |                      |

✍️ Verwenden Sie römische Ziffern für Ihre Bug Reports, also I, II, III, IV etc.

## 6 Auswerten

✍️ Fügen Sie hier eine Verknüpfung zu Ihrem Lern-Bericht ein.
