import template from './sms77-api-compose.html.twig';
import {Sms77ApiMixin} from '../Sms77ApiMixin';

const strings = {
    delay: null,
    foreign_id: null,
    from: null,
    label: null,
    udh: null,
};

const booleans = {
    debug: false,
    details: false,
    flash: false,
    json: false,
    no_reload: false,
    performance_tracking: false,
    return_msg_id: false,
    unicode: false,
    utf8: false,
};

const numbers = {
    ttl: null,
};

Shopware.Component.register('sms77-api-compose', {
    computed: {
        customerGroupRepository() {
            return this.repositoryFactory.create('customer_group');
        },

        isDisabled() {
            if ((!this.configuration.text || '').length) {
                return true;
            }

            return !(this.configuration.to || '').length
                && !(this.configuration.customerGroupIds || []).length;
        },

        customerRepository() {
            return this.repositoryFactory.create('customer');
        },
    },

    async created() {
        this.systemConfig = await this.getSystemConfig();

        this.configuration.from = (this.systemConfig.from || '');
        this.configuration.text = this.addSignature('');

        this.customerGroups = new Shopware.Data.EntityCollection(
            this.customerGroupRepository.route,
            this.customerGroupRepository.entityName,
            Shopware.Context.api
        );
    },

    data: () => ({
        configuration: {
            text: null,
            to: null,
            ...strings,
            ...booleans,
            ...numbers,
            customerGroupIds: null,
        },
        customerGroups: null,
        info: null,
        isLoading: false,
    }),

    methods: {
        setCustomerGroupIds(customerGroups) {
            this.customerGroups = customerGroups;

            this.configuration.customerGroupIds = this.customerGroups.getIds();
        },

        commonSettingAttrs(name, placeholder = true) {
            const obj = {
                label: this.translateSettingLabel(name),
                name,
            };

            if (placeholder) {
                obj.placeholder = this.translateSettingDesc(name);
            }

            return obj;
        },

        filterByType(type) {
            return Object.keys(this.configuration)
                .filter(key => typeof this.configuration[key] === type);
        },

        translateSetting(name, key) {
            return this.$tc(`sms77-api.compose.${name}.${key}`);
        },

        translateSettingTooltip(name) {
            return {message: this.translateSettingDesc(name)};
        },

        translateSettingLabel(name) {
            return this.translateSetting(name, 'label');
        },

        translateSettingDesc(name) {
            return this.translateSetting(name, 'desc');
        },

        async handleSubmit() {
            this.isLoading = true;

            if ((this.configuration.customerGroupIds || []).length) {
                let phoneNumbers = [];

                for (const customer of await this.customerRepository.search(
                    new Shopware.Data.Criteria(1, 500)
                        .addAssociation('addresses')
                        .addFilter(Shopware.Data.Criteria.equals(
                            'active', true))
                        .addFilter(Shopware.Data.Criteria.equalsAny(
                            'groupId', this.configuration.customerGroupIds)),
                    Shopware.Context.api)) {
                    let phone = null;

                    for (const address of customer.addresses) {
                        if ((address.phoneNumber || '').length) {
                            phone = address.phoneNumber;

                            if (customer.defaultShippingAddressId) {
                                break;
                            }

                            break;
                        }
                    }

                    if (phone) {
                        phoneNumbers.push(phone);
                    }
                }

                if (phoneNumbers.length) {
                    this.configuration.to = phoneNumbers.join(',');
                }
            }

            const response = await this.sendSms(this.configuration);
            const entity = this.createEntity(response);
            await this.saveEntity(entity);

            this.isLoading = false;

            this.$router.push({name: 'sms77.api.index',});
        },
    },

    mixins: [Sms77ApiMixin,],

    optionalFields: {
        booleans: Object.keys(booleans),
        numbers: Object.keys(numbers),
        strings: Object.keys(strings),
    },

    template,
});
