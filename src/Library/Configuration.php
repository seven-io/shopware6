<?php declare(strict_types=1);

namespace Sms77\Shopware6\Library;

use Shopware\Core\System\SystemConfig\SystemConfigService;

class Configuration
{
    /** @var SystemConfigService $systemConfigService */
    public $systemConfigService;

    /** @var array|mixed|null $config */
    public $config;

    public const CONFIG_KEY = 'Sms77Shopware6.config';

    public function __construct(SystemConfigService $systemConfigService)
    {
        $this->systemConfigService = $systemConfigService;

        $this->config = $this->systemConfigService->get(self::CONFIG_KEY);
    }

    public function byKey(string $key)
    {
        return $this->config[$key];
    }

    public function delete(): void
    {
        $this->systemConfigService->delete(self::CONFIG_KEY);
    }

    public function isEventEnabled(string $event): bool
    {
        $events = $this->byKey('events');

        if (!is_array($events)) {
            return false;
        }

        return in_array($event, $events);
    }
}