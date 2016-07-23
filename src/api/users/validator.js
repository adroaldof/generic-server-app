import Joi from 'joi';

export default {
    /**
     * POST /api/users
     */
    createUser: {
        body: {
            name: Joi.string().min(4).max(50),
            email: Joi.string().email().required(),
            mobileNumber: Joi.string().regex(/^[1-9][0-9]{8,15}$/),
            password: Joi.string().required()
        }
    },

    /**
     * PUT /api/users/:id/update
     */
    updateUser: {
        body: {
            name: Joi.string().min(4).max(50),
            email: Joi.string().email().required(),
            mobileNumber: Joi.string().regex(/^[1-9][0-9]{8,15}$/)
        },
        params: {
            id: Joi.string().hex().required()
        }
    },

    /**
     * PUT /api/users/:id/password
     */
    changeUserPassword: {
        body: {
            password: Joi.string().required(),
            newPassword: Joi.string().required()
        },
        params: {
            id: Joi.string().hex().required()
        }
    }
};
