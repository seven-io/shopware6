![Sms77.io Logo](https://www.sms77.io/wp-content/uploads/2019/07/sms77-Logo-400x79.png "sms77")

# Sms77.io plugin for Shopware 6

## Installation
<ol>
<li>Open a shell and navigate to the Shopware installation directory</li>
<li>Run <code>composer require sms77/shopware6</code></li>
<li>Run <code>php bin/console cache:clear</code></li>
<li>Run <code>php bin/console database:migrate --all Sms77Shopware6</code></li>
<li>Navigate to Administration -&gt; Settings -&gt; System -&gt; Plugins -&gt; sms77io</li>
<li>Enter and save the required API key</li>
</ol>

### Plugin options
<ul>
<li>Set a signature</li>
<li>Set the signature position</li>
<li>Set a fixed sender identifier</li>
<li>Set a fixed message receiver</li>
</ul>

### Event-based message dispatch at:
<ul>
<li>Canceled order</li>
<li>Finalized order</li>
<li>Canceled delivery</li>
<li>Return delivery</li>
<li>Part return delivery</li>
<li>Outbound delivery</li>
<li>Partial shipment</li>
<li>Canceled payment</li>
<li>Payment settlement</li>
<li>Partial payment settlement</li>
<li>Payment refund</li>
<li>Partial payment refund</li>
<li>Payment reminder</li>
</ul>

#### Screenshots
![Screenshot of compose page](https://tettra-production.s3.us-west-2.amazonaws.com/0d6efb4f154041e899af17bdcd19c1b5/bcac36a50716f4f73cd84020c4bf091d/d822b155a4112474fdb7aea5ee22465e/cb30d8dd64d0e83fcc7822a40f1703d9/LvK98NgceAQ3333Uuxin7nOBQe90CiS8HwLQXDA8.png "Shopware6.Sms77: Compose SMS")
![Screenshot 1/4 of plugin settings](https://tettra-production.s3.us-west-2.amazonaws.com/0d6efb4f154041e899af17bdcd19c1b5/bcac36a50716f4f73cd84020c4bf091d/d822b155a4112474fdb7aea5ee22465e/cb30d8dd64d0e83fcc7822a40f1703d9/qS6RVUwCMnYQYKrGy7O4wCi3EFDHbhvZl4IeuUjO.png "Shopware6.Sms77: Plugin Settings 1/4")
![Screenshot 2/4 of plugin settings](https://tettra-production.s3.us-west-2.amazonaws.com/0d6efb4f154041e899af17bdcd19c1b5/bcac36a50716f4f73cd84020c4bf091d/d822b155a4112474fdb7aea5ee22465e/cb30d8dd64d0e83fcc7822a40f1703d9/7F6MwKyQqDc6qKrPj2aTvg6yar0OIRBmnkJG9ZMc.png "Shopware6.Sms77: Plugin Settings 2/4")
![Screenshot 3/4 of plugin settings](https://tettra-production.s3.us-west-2.amazonaws.com/0d6efb4f154041e899af17bdcd19c1b5/bcac36a50716f4f73cd84020c4bf091d/d822b155a4112474fdb7aea5ee22465e/cb30d8dd64d0e83fcc7822a40f1703d9/khPXkX7m5AJRDmBHyt5WbxhAbfVt2TwXG9oAQ1Mv.png "Shopware6.Sms77: Plugin Settings 3/4")
![Screenshot 4/4 of plugin settings](https://tettra-production.s3.us-west-2.amazonaws.com/0d6efb4f154041e899af17bdcd19c1b5/bcac36a50716f4f73cd84020c4bf091d/d822b155a4112474fdb7aea5ee22465e/cb30d8dd64d0e83fcc7822a40f1703d9/W06KCtdmDXdhN0EsGZD7WSyXie2Z5v2ApgniyiKk.png "Shopware6.Sms77: Plugin Settings 4/4")