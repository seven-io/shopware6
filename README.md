<p align="center">
<img src="https://www.sms77.io/wp-content/uploads/2019/07/sms77-Logo-400x79.png" alt="" />
</p>

# sms77io plugin for Shopware 6

## Installation
<ol>
<li>Open a shell and navigate to the Shopware installation directory</li>
<li>Run <code>composer require sms77/shopware6</code></li>
<li>Run <code>php bin/console cache:clear</code></li>
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

#### ToDo
- Tests