<?php declare(strict_types=1);

namespace Seven\Shopware6\Library;

use Shopware\Core\System\SystemConfig\SystemConfigService;

class Configuration {
    public const CONFIG_KEY = 'SevenShopware6.config';
    public array|mixed|null $config;

    public function __construct(
        public SystemConfigService $systemConfigService
    ) {
        $this->config = $this->systemConfigService->get(self::CONFIG_KEY);
    }

    public function delete(): void {
        $this->systemConfigService->delete(self::CONFIG_KEY);
    }

    public function isEventEnabled(string $event): bool {
        $events = $this->byKey('events');

        if (!is_array($events)) {
            return false;
        }

        return in_array($event, $events);
    }

    public function byKey(string $key): mixed {
        return $this->config[$key];
    }
}