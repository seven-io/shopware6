<?php declare(strict_types=1);

namespace Sms77\Shopware6\Core\Content\Message;

use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class MessageEntity extends Entity {
    use EntityIdTrait;

    /** @var string $config */
    protected $config;

    /** @var string $response */
    protected $response;

    /** @var string $type */
    protected $type;

    public function getConfig(): string {
        return $this->config;
    }

    public function setConfig(string $config): void {
        $this->config = $config;
    }

    public function getResponse(): string {
        return $this->response;
    }

    public function setResponse(string $response): void {
        $this->response = $response;
    }

    public function getType(): string {
        return $this->config;
    }

    public function setType(string $type): void {
        $this->type = $type;
    }
}