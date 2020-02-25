<?php declare(strict_types=1);

namespace Sms77\Shopware6\Backend\Order\Subscriber;

use Monolog\Handler\ErrorLogHandler;
use Monolog\Logger;
use Shopware\Core\Checkout\Order\Event\OrderStateMachineStateChangeEvent;
use Sms77\Shopware6\Library\Configuration;
use Sms77\Shopware6\Library\SmsUtility;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class OrderSubscriber implements EventSubscriberInterface
{
    /** @var Logger $logger */
    protected $logger;

    /** @var Configuration $configuration */
    protected $configuration;

    /** @var SmsUtility $smsUtility */
    private $smsUtility;

    public function __construct(Logger $logger, Configuration $configuration, SmsUtility $smsUtility)
    {
        $logger->pushHandler(new ErrorLogHandler());

        $this->logger = $logger;

        $this->configuration = $configuration;

        $this->smsUtility = $smsUtility;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'state_enter.order.state.cancelled' => 'onOrderCancelled',
            'state_enter.order.state.completed' => 'onOrderCompleted',

            'state_enter.order_delivery.state.cancelled' => 'onOrderDeliveryCancelled',
            'state_enter.order_delivery.state.returned' => 'onOrderDeliveryReturned',
            'state_enter.order_delivery.state.returned_partially' => 'onOrderDeliveryReturnedPartially',
            'state_enter.order_delivery.state.shipped' => 'onOrderDeliveryShipped',
            'state_enter.order_delivery.state.shipped_partially' => 'onOrderDeliveryShippedPartially',

            'state_enter.order_transaction.state.cancelled' => 'onOrderTransactionCancelled',
            'state_enter.order_transaction.state.paid' => 'onOrderTransactionPaid',
            'state_enter.order_transaction.state.paid_partially' => 'onOrderTransactionPaidPartially',
            'state_enter.order_transaction.state.refunded' => 'onOrderTransactionRefunded',
            'state_enter.order_transaction.state.refunded_partially' => 'onOrderTransactionRefundedPartially',
            'state_enter.order_transaction.state.reminded' => 'onOrderTransactionReminded',
        ];
    }

    private function sendIfEventEnabled(string $eventName, OrderStateMachineStateChangeEvent $event)
    {
        if ($this->configuration->isEventEnabled('state_enter.' . $eventName)) {
            $this->smsUtility->send($this->configuration->config, $event);
        }
    }

    public function onOrderCancelled(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order.state.cancelled', $event);
    }

    public function onOrderCompleted(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order.state.completed', $event);
    }

    public function onOrderDeliveryCancelled(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_delivery.state.cancelled', $event);
    }

    public function onOrderDeliveryReturned(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_delivery.state.returned', $event);
    }

    public function onOrderDeliveryReturnedPartially(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_delivery.state.returned_partially', $event);
    }

    public function onOrderDeliveryShipped(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_delivery.state.shipped', $event);
    }

    public function onOrderDeliveryShippedPartially(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_delivery.state.shipped_partially', $event);
    }

    public function onOrderTransactionCancelled(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_transaction.state.cancelled', $event);
    }

    public function onOrderTransactionPaid(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_transaction.state.paid', $event);
    }

    public function onOrderTransactionPaidPartially(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_transaction.state.paid_partially', $event);
    }

    public function onOrderTransactionRefunded(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_transaction.state.refunded', $event);
    }

    public function onOrderTransactionRefundedPartially(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_transaction.state.refunded_partially', $event);
    }

    public function onOrderTransactionReminded(OrderStateMachineStateChangeEvent $event)
    {
        $this->sendIfEventEnabled('order_transaction.state.reminded', $event);
    }
}