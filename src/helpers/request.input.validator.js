const yup = require("yup");

// Validation for registraion.
exports.adminRegUserInputs = yup.object({
    body: yup.object({
        userName: yup.string().required(),
        fullName: yup.string().required(),
        email: yup.string().email().required(),
        phone: yup.number(),
        password: yup.string().min(6).required(),
        role: yup.string().required()
    })
});    
// Validation for admin login.
exports.adminLoginInputs = yup.object({
    body: yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(6).required()
    })
});
// validation for role name
exports.roleCtrInputValidator = (action = null) => {
    return yup.object({
        body: yup.object({
            name: yup.string().required()
       }),
       ...(action==="edit" ?  { 
        params: yup.object({
            id: yup.string().required()
        })
        } : null)
    });
}
// validation for category
exports.categoryCtrInputValidator = yup.object({
    body: yup.object({
        name: yup.string().required(),
        status: yup.string().required(),
    })
});
// validation for package
exports.pakcageCtrInputValidator = yup.object({
    body: yup.object({
        package_title: yup.string().required(),
        number_of_days: yup.number().required(),
        number_of_nights: yup.number().required(),
        price_deluxe: yup.number().required(),
        price_super_deluxe: yup.number().required(),
        package_itinerary: yup.string().required(),
        category_id: yup.string().required(),
        from_date: yup.date().required(),
        to_date: yup.date().required(),
        pax_count: yup.number().required('Required maximum persons count'),
        status: yup.number().required("Status is required")
    })
});