<?php declare(strict_types=1);

namespace Seven\Shopware6\Core\Content\Message;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void              add(MessageEntity $entity)
 * @method void              set(string $key, MessageEntity $entity)
 * @method MessageEntity[]    getIterator()
 * @method MessageEntity[]    getElements()
 * @method MessageEntity|null get(string $key)
 * @method MessageEntity|null first()
 * @method MessageEntity|null last()
 */
class MessageCollection extends EntityCollection {
    protected function getExpectedClass(): string {
        return MessageEntity::class;
    }
}