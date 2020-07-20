<?php declare(strict_types=1);

namespace Sms77\Shopware6\Core\Content\Message;

use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\JsonField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class MessageDefinition extends EntityDefinition {
    public const ENTITY_NAME = 'sms77_message';

    public function getEntityName(): string {
        return self::ENTITY_NAME;
    }

    public function getCollectionClass(): string {
        return MessageCollection::class;
    }

    public function getEntityClass(): string {
        return MessageEntity::class;
    }

    protected function defineFields(): FieldCollection {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            (new StringField('type', 'type'))->addFlags(new Required()),
            (new JsonField('config', 'config'))->addFlags(new Required()),
            new JsonField('response', 'response'),
        ]);
    }
}