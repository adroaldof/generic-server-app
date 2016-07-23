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

            mobileNumber: Joi.string().regex(/^[1-9][0-9]{8,15}$/)
        }
    },

    /**
     * PUT /api/users/:userId
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
    }
};
