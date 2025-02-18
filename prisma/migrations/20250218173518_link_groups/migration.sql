-- CreateTable
CREATE TABLE "LinkGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,

    CONSTRAINT "LinkGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "tenantId" TEXT NOT NULL,
    "urlParams" JSONB NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkOnPublicPage" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "linkId" TEXT NOT NULL,

    CONSTRAINT "LinkOnPublicPage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LinkGroup" ADD CONSTRAINT "LinkGroup_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkOnPublicPage" ADD CONSTRAINT "LinkOnPublicPage_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
