-- DropForeignKey
ALTER TABLE "LinkOnPublicPage" DROP CONSTRAINT "LinkOnPublicPage_linkId_fkey";

-- AlterTable
ALTER TABLE "LinkOnPublicPage" ALTER COLUMN "linkId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LinkOnPublicPage" ADD CONSTRAINT "LinkOnPublicPage_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;
