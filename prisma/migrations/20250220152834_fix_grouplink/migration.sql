/*
  Warnings:

  - You are about to drop the column `linkId` on the `LinkGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LinkGroup" DROP CONSTRAINT "LinkGroup_linkId_fkey";

-- AlterTable
ALTER TABLE "LinkGroup" DROP COLUMN "linkId";

-- CreateTable
CREATE TABLE "_LinkToLinkGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LinkToLinkGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LinkToLinkGroup_B_index" ON "_LinkToLinkGroup"("B");

-- AddForeignKey
ALTER TABLE "_LinkToLinkGroup" ADD CONSTRAINT "_LinkToLinkGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkToLinkGroup" ADD CONSTRAINT "_LinkToLinkGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "LinkGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
