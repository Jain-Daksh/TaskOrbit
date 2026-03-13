/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,order]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Status_workspaceId_name_key";

-- CreateIndex
CREATE INDEX "Status_workspaceId_order_idx" ON "Status"("workspaceId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Status_workspaceId_order_key" ON "Status"("workspaceId", "order");
