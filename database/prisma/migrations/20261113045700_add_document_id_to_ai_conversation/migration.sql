-- AlterTable
ALTER TABLE "AIConversation" ADD COLUMN     "documentId" TEXT;

-- CreateIndex
CREATE INDEX "AIConversation_documentId_idx" ON "AIConversation"("documentId");

-- CreateIndex
CREATE INDEX "AIConversation_updatedAt_idx" ON "AIConversation"("updatedAt");
