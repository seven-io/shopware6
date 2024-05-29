<?php declare(strict_types=1);

namespace Seven\Shopware6\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1595155475 extends MigrationStep {
    public function getCreationTimestamp(): int {
        return 1595155475;
    }

    public function update(Connection $connection): void {
        $connection->executeUpdate('
            CREATE TABLE IF NOT EXISTS `seven_message` (
              `id` BINARY(16) NOT NULL,
              `type` VARCHAR(25) NOT NULL,
              `config` LONGTEXT NOT NULL,
              `response` LONGTEXT NULL,
              `created_at` DATETIME(3) NOT NULL,
              `updated_at` DATETIME(3) NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void {
        // implement update destructive
    }
}
