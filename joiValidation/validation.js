const joi = require('joi');

// Register validation

const registerValidation=(data)=>{
const schema= joi.object ({
username: joi.string().min(6).required(),
email: joi.string().min(6).required().email(),
password: joi.string().min(6).required(),
});
return schema.validate(data);
}

const loginValidation =(data)=>{
    const schema= joi.object ({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required(),
        });
        return schema.validate(data);
        };

        const taskValidation = (data) => {
            const schema = joi.object({
              title: joi.string().min(3).required(),
              description: joi.string().allow(''),
              status: joi.string().valid('pending', 'in-progress', 'completed'),
              dueDate: joi.date().optional(),
            });
            return schema.validate(data);
          };

module.exports={registerValidation, loginValidation, taskValidation};