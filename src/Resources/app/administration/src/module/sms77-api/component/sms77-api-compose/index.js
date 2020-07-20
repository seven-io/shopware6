import template from './sms77-api-compose.html.twig';
import {Sms77ApiMixin} from '../Sms77ApiMixin';

const required = {
    text: null,
    to: null,
};

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

const component = {
    async created() {
        this.systemConfig = await this.getSystemConfig();

        this.configuration.from = (this.systemConfig.from || '');
        this.configuration.text = this.addSignature('');
    },

    computed: {
        isDisabled() {
            return !((this.configuration.to || '').length
                && (this.configuration.text || '').length);
        }
    },

    optionalFields: {
        booleans: Object.keys(booleans),
        strings: Object.keys(strings),
        numbers: Object.keys(numbers),
    },

    data: () => ({
        configuration: {
            ...required,
            ...strings,
            ...booleans,
            ...numbers,
        },
        info: null,
        isLoading: false,
    }),

    methods: {
        commonSettingAttrs(name, placeholder = true) {
            const obj = {
                label: this.translateSetting(name, 'label'),
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

        translateSettingDesc(name) {
            return this.translateSetting(name, 'desc');
        },

        async handleSubmit(ev) {
            this.isLoading = true;

            await this.saveEntity(
                this.createEntity(await this.sendSms(ev.target)));

            this.isLoading = false;

            this.$router.push({name: 'sms77.api.index',});
        },
    },

    mixins: [Sms77ApiMixin,],

    template,
};

Shopware.Component.register('sms77-api-compose', component);
