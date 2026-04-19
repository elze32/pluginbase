-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNCLASSIFIED', 'ESSENTIAL', 'DOUBLON', 'UNUSED', 'TO_LEARN', 'TO_SELL', 'TO_TEST');

-- CreateEnum
CREATE TYPE "UsageLevel" AS ENUM ('DAILY', 'WEEKLY', 'RARELY', 'NEVER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PluginInstallation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pluginNameRaw" TEXT NOT NULL,
    "normalizedPluginName" TEXT NOT NULL,
    "brandRaw" TEXT,
    "normalizedBrand" TEXT,
    "format" TEXT NOT NULL,
    "version" TEXT,
    "installPath" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PluginInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PluginMaster" (
    "normalizedPluginName" TEXT NOT NULL,
    "normalizedBrand" TEXT,
    "pluginType" TEXT,
    "category" TEXT,
    "subcategory" TEXT,
    "descriptionFr" TEXT,
    "parametersJson" TEXT,

    CONSTRAINT "PluginMaster_pkey" PRIMARY KEY ("normalizedPluginName")
);

-- CreateTable
CREATE TABLE "UserPluginState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'UNCLASSIFIED',
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "personalNote" TEXT,
    "customTags" TEXT[],
    "usageEstimate" "UsageLevel",
    "purchaseInterest" BOOLEAN NOT NULL DEFAULT false,
    "sellInterest" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPluginState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserPluginState_installationId_key" ON "UserPluginState"("installationId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PluginInstallation" ADD CONSTRAINT "PluginInstallation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PluginInstallation" ADD CONSTRAINT "PluginInstallation_normalizedPluginName_fkey" FOREIGN KEY ("normalizedPluginName") REFERENCES "PluginMaster"("normalizedPluginName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPluginState" ADD CONSTRAINT "UserPluginState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPluginState" ADD CONSTRAINT "UserPluginState_installationId_fkey" FOREIGN KEY ("installationId") REFERENCES "PluginInstallation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
