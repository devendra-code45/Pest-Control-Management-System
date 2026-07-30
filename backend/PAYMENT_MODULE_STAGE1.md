# Payment Module — Stage 1

This stage contains only the payment/invoice enums, entities, DTOs, and
repositories requested for the first backend checkpoint.

## Confirmed business rules

- Online payments and direct bank transfers are active for the first release.
- Cash is represented for future compatibility but must remain disabled until
  technician authentication is implemented.
- One booking can be paid through an advance transaction and a later balance
  transaction.
- The remaining balance uses an admin-set due date.
- Direct bank transfers require a UTR/reference number and a payment screenshot.
- Direct bank transfers remain pending until an admin verifies them.
- The payment gateway is not selected yet, so gateway fields are
  provider-neutral.
- Service prices are GST-inclusive.
- GST rates are configurable per service and must be copied to invoice items so
  historical invoices do not change.
- The invoice model supports both CGST + SGST and future IGST billing.
- GST invoice issuing must remain disabled until the business GSTIN and legal
  supplier details are verified.

## Enums

Location: `src/main/java/com/pcms/payment/entity/`

- `PaymentMethod.java` — Enum
- `PaymentStatus.java` — Enum
- `PaymentPurpose.java` — Enum
- `PaymentVerificationStatus.java` — Enum
- `PaymentScheduleStatus.java` — Enum
- `InvoiceStatus.java` — Enum
- `TaxType.java` — Enum
- `CustomerBillingType.java` — Enum

## Entities

Location: `src/main/java/com/pcms/payment/entity/`

- `PaymentSchedule.java` — Entity class
- `PaymentTransaction.java` — Entity class
- `Invoice.java` — Entity class
- `InvoiceItem.java` — Entity class

## Request DTOs

Location: `src/main/java/com/pcms/payment/dto/`

- `CreatePaymentScheduleRequest.java` — Request DTO class
- `UpdatePaymentScheduleRequest.java` — Request DTO class
- `CreateOnlinePaymentRequest.java` — Request DTO class
- `SubmitBankTransferRequest.java` — Request DTO class
- `VerifyBankTransferRequest.java` — Request DTO class
- `GenerateInvoiceRequest.java` — Request DTO class

## Response DTOs

Location: `src/main/java/com/pcms/payment/dto/`

- `PaymentScheduleResponse.java` — Response DTO class
- `PaymentTransactionResponse.java` — Response DTO class
- `InvoiceItemResponse.java` — Response DTO class
- `InvoiceResponse.java` — Response DTO class

## Repositories

Location: `src/main/java/com/pcms/payment/repository/`

- `PaymentScheduleRepository.java` — Repository interface
- `PaymentTransactionRepository.java` — Repository interface
- `InvoiceRepository.java` — Repository interface
- `InvoiceItemRepository.java` — Repository interface

## Required related work for later stages

The existing booking flow must later collect and persist:

- customer billing type
- legal business name
- customer GSTIN
- billing address
- billing state and state code
- billing pincode

The next backend stage must add:

- service interfaces
- service implementation classes with transactional locking
- gateway adapter interface
- secure proof-file upload flow
- controllers
- JWT ownership checks
- SecurityConfig review
- database migration scripts
- Postman tests

No service, controller, SecurityConfig, or frontend code is included in this
stage.
