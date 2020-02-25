<?php declare(strict_types=1);

namespace Sms77\Shopware6\Library;

use Shopware\Core\Checkout\Order\Aggregate\OrderAddress\OrderAddressEntity;
use Shopware\Core\Checkout\Order\Event\OrderStateMachineStateChangeEvent;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Sms77\Api\Client;

class SmsUtility
{
    /** @var EntityRepository $orderAddressRepository */
    protected $orderAddressRepository;

    /** @var Configuration $configuration */
    protected $configuration;

    public function __construct(Configuration $configuration, EntityRepository $orderAddressRepository)
    {
        $this->configuration = $configuration;

        $this->orderAddressRepository = $orderAddressRepository;
    }

    public function send(array $pluginConfig, OrderStateMachineStateChangeEvent $event): array
    {
        $response = null;
        $phone = null;
        $client = null;
        $extras = ['json' => 1,];
        $context = $event->getContext();
        $order = $event->getOrder();

        $billingAddressId = $order->getBillingAddressId();
        $criteria = new Criteria([$billingAddressId]);
        /* @var OrderAddressEntity $billingAddress */
        $billingAddress = $this->orderAddressRepository->search($criteria, $context)->getEntities()->first();
        $phone = $billingAddress->getPhoneNumber();
        if (null === $phone) {
            $addresses = $order->getAddresses();

            if (null !== $addresses) {
                foreach ($addresses->getElements() as $address) {
                    $number = $address->getPhoneNumber();

                    if (mb_strlen($number)) {
                        $phone = $number;

                        break;
                    }
                }
            }
        }

        if (null !== $phone) {
            if (isset($pluginConfig['from'])) {
                $extras['from'] = $pluginConfig['from'];
            }

            $client = new Client($pluginConfig['apiKey'], 'shopware6');

            $text = SmsUtility::getText($event->getName(), $pluginConfig);

            $response = $client->sms(
                $phone,
                $text,
                $extras
            );
        }

        return compact('phone', 'address', 'text', 'response', 'extras', 'client');
    }

    public static function getText(string $eventName, array $pluginConfig): ?string
    {
        $text = null;

        $mappings = [
            'state_enter.order.state.cancelled' => 'OrderCancelled',
            'state_enter.order.state.completed' => 'OrderCompleted',

            'state_enter.order_delivery.state.cancelled' => 'OrderDeliveryCancelled',
            'state_enter.order_delivery.state.returned' => 'OrderDeliveryReturned',
            'state_enter.order_delivery.state.returned_partially' => 'OrderDeliveryReturnedPartially',
            'state_enter.order_delivery.state.shipped' => 'OrderDeliveryShipped',
            'state_enter.order_delivery.state.shipped_partially' => 'OrderDeliveryShippedPartially',

            'state_enter.order_transaction.state.cancelled' => 'OrderTransactionCancelled',
            'state_enter.order_transaction.state.paid' => 'OrderTransactionPaid',
            'state_enter.order_transaction.state.paid_partially' => 'OrderTransactionPaidPartially',
            'state_enter.order_transaction.state.refunded' => 'OrderTransactionRefunded',
            'state_enter.order_transaction.state.refunded_partially' => 'OrderTransactionRefundedPartially',
            'state_enter.order_transaction.state.reminded' => 'OrderTransactionReminded',
        ];

        if (array_key_exists($eventName, $mappings)) {
            $cfgKey = 'textOn' . $mappings[$eventName];

            if (array_key_exists($cfgKey, $pluginConfig)) {
                $text = $pluginConfig[$cfgKey];
            }
        }

        if (array_key_exists('signature', $pluginConfig) && mb_strlen($pluginConfig['signature'])) {
            $text = 'prepend' === $pluginConfig['signaturePosition']
                ? $text + $pluginConfig['signature']
                : $pluginConfig['signature'] + $text;
        }

        return $text;
    }
}