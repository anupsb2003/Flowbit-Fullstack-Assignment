-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "issue_date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "document_url" TEXT,
    "vendor_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "invoice_id" TEXT NOT NULL,

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "payment_date" DATE,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "payment_method" TEXT,
    "invoice_id" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendor_id_key" ON "Vendor"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_id_key" ON "Customer"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_number_key" ON "Invoice"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_invoice_id_key" ON "Payment"("invoice_id");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
