<img src="https://www.seven.io/wp-content/uploads/Logo.svg" width="250" />

# seven.io plugin for Shopware 6

## Installation

1. Open a shell and navigate to the Shopware installation directory
2. Run `composer require seven.io/shopware6`
3. Run `php bin/console cache:clear`
4. Run `php bin/console database:migrate --all SevenShopware6`
5. Navigate to Administration -> Settings -> System -> Plugins -> seven
6. Enter and save the required API key

You can alternatively download
the [latest Release](https://github.com/seven-io/shopware6/releases/latest) and
upload the *.zip via the plugin manager.

### Plugin options

- Set a signature
- Set the signature position
- Set a fixed sender identifier
- Set a fixed message receiver


### Event-based message dispatch at:

- Canceled order
- Finalized order
- Canceled delivery
- Return delivery
- Part return delivery
- Outbound delivery
- Partial shipment
- Canceled payment
- Payment settlement
- Partial payment settlement
- Payment refund
- Partial payment refund
- Payment reminder


### Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact/).

[![MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)