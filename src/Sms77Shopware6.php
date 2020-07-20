<?php declare(strict_types=1);

namespace Sms77\Shopware6;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\ContainsFilter;
use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;
use Sms77\Shopware6\Library\Configuration;

class Sms77Shopware6 extends Plugin {
    public function uninstall(UninstallContext $context): void {
        if (!$context->keepUserData()) {
            $this->removeConfiguration($context->getContext());
        }

        parent::uninstall($context);
    }

    private function removeConfiguration(Context $context): void {
        /* @var EntityRepositoryInterface $systemConfigRepository */
        $systemConfigRepository = $this->container->get('system_config.repository');

        $systemConfigRepository->delete(array_map(static function($id) {
            return ['id' => $id];
        }, $systemConfigRepository
            ->searchIds((new Criteria())->addFilter(new ContainsFilter(
                    'configurationKey', Configuration::CONFIG_KEY . '.')
            ), $context)->getIds()), $context);
    }
}