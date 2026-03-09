/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,name]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Status_workspaceId_name_key" ON "Status"("workspaceId", "name");
