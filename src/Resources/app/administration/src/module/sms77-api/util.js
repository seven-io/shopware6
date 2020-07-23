export const getCustomerPhones = (customers) => {
    let phoneNumbers = [];

    for (const customer of customers) {
        let phone = null;

        for (const address of customer.addresses) {
            if ((address.phoneNumber || '').length) {
                phone = address.phoneNumber;

                if (customer.defaultShippingAddressId) {
                    break;
                }
            }
        }

        if (phone) {
            phoneNumbers.push(phone);
        }
    }

    return phoneNumbers.join(',');
};