<?php /** @noinspection PhpUnused */
declare(strict_types=1);

namespace Seven\Shopware6\Backend\Order\Subscriber;

use Shopware\Core\Checkout\Order\Event\OrderStateMachineStateChangeEvent;
use Seven\Shopware6\Library\Configuration;
use Seven\Shopware6\Library\SmsUtility;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class OrderSubscriber implements EventSubscriberInterface {
    public function __construct(
        protected Configuration $configuration,
        private SmsUtility $smsUtility
    ) {}

    public static function getSubscribedEvents(): array {
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

    public function onOrderCancelled(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order.state.cancelled', $event);
    }

    private function sendIfEventEnabled(string $eventName, OrderStateMachineStateChangeEvent $event): void {
        if ($this->configuration->isEventEnabled('state_enter.' . $eventName)) {
            $this->smsUtility->send($this->configuration->config, $event);
        }
    }

    public function onOrderCompleted(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order.state.completed', $event);
    }

    public function onOrderDeliveryCancelled(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_delivery.state.cancelled', $event);
    }

    public function onOrderDeliveryReturned(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_delivery.state.returned', $event);
    }

    public function onOrderDeliveryReturnedPartially(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_delivery.state.returned_partially', $event);
    }

    public function onOrderDeliveryShipped(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_delivery.state.shipped', $event);
    }

    public function onOrderDeliveryShippedPartially(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_delivery.state.shipped_partially', $event);
    }

    public function onOrderTransactionCancelled(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_transaction.state.cancelled', $event);
    }

    public function onOrderTransactionPaid(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_transaction.state.paid', $event);
    }

    public function onOrderTransactionPaidPartially(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_transaction.state.paid_partially', $event);
    }

    public function onOrderTransactionRefunded(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_transaction.state.refunded', $event);
    }

    public function onOrderTransactionRefundedPartially(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_transaction.state.refunded_partially', $event);
    }

    public function onOrderTransactionReminded(OrderStateMachineStateChangeEvent $event): void {
        $this->sendIfEventEnabled('order_transaction.state.reminded', $event);
    }
}