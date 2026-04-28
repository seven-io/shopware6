<p align="center">
  <img src="https://www.seven.io/wp-content/uploads/Logo.svg" width="250" alt="seven logo" />
</p>

<h1 align="center">seven SMS for Shopware 6</h1>

<p align="center">
  Send manual and event-based SMS for orders, deliveries and payments in <a href="https://www.shopware.com/">Shopware 6</a> via the seven gateway.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-teal.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Shopware-6.x-blue" alt="Shopware 6.x" />
  <img src="https://img.shields.io/badge/PHP-7.4%2B-purple" alt="PHP 7.4+" />
</p>

---

## Features

- **Compose SMS** - Send messages directly from the Shopware admin
- **Signature Support** - Append a configurable signature to outbound messages and pick its position
- **Fixed Sender / Receiver** - Lock down the sender ID or recipient per shop instance
- **Event-Based Dispatch** - Auto-fire SMS on:
  - Canceled order, Finalized order
  - Canceled / Return / Part-return / Outbound / Partial-shipment delivery events
  - Canceled / Settled / Partial-settled / Refunded / Partial-refunded / Reminder payment events

## Prerequisites

- Shopware 6.x
- PHP 7.4+
- A [seven account](https://www.seven.io/) with API key ([How to get your API key](https://help.seven.io/en/developer/where-do-i-find-my-api-key))

## Installation

### Composer (recommended)

```bash
cd /path/to/shopware
composer require sms77/shopware6
php bin/console cache:clear
php bin/console database:migrate --all Sms77Shopware6
```

### Manual

Download the [latest release](https://github.com/seven-io/shopware6/releases/latest) ZIP and upload it via **Settings > System > Plugins** in the Shopware admin.

## Configuration

Open **Administration > Settings > System > Plugins > sms77io**, paste your seven API key and save.

| Option | Description |
|--------|-------------|
| API key | Your seven API key |
| Signature | Static text appended to every outbound SMS |
| Signature position | Where the signature is appended (before / after the body) |
| Fixed sender identifier | Override the per-message sender |
| Fixed message receiver | Override the per-message recipient |

## Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact/) or [open an issue](https://github.com/seven-io/shopware6/issues).

## License

[MIT](LICENSE)
