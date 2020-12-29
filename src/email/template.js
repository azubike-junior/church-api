import Mailgen from 'mailgen';
import { userType, verificationIntro, verifyColor, verifyOutro, verifyText } from '../api/utils/constant';

const mailgen = new Mailgen({
    theme: 'default',
    product: {
        name: 'MGC YOUTH PLATFORM',
        link: '#'
    }
});

const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

export const emailVerificationTemplate = (name, url) => {
   const email = {
        body: {
            name: capitalize(name),
            intro: verificationIntro,
            action: {
                instructions: 'To continue with your email verification, please click here',
                button: {
                    text: verifyText,
                    link: url,
                    color: verifyColor,
                },
           },
        outro: 'Need help, or have questions? Please contact us at https://google.com',
        },
    }
    return mailgen.generate(email)
};

export const assignedMemberToHODTemplate = (user, unit, url) => {
    let introAdditional;
    introAdditional = `Member with ${user.name} as been assigned an HOD of the ${unit.name} unit`;
      const email = {
        body: {
            name: capitalize(user.name),
            intro: introAdditional,
            action: {
                instructions: 'to go to your unit, please click the link below',
                button: {
                    text: 'View Unit',
                    link: url,
                    color: 'blue',
                },
              },
             outro: 'Need help, or have questions? Please contact us at https://google.com',
        },
    }
    return mailgen.generate(email)

}

export const assignedMemberToUnitTemplate = (unit, user, url) => {
    let introAdditional;
    introAdditional = `Member with ${user.name} as been assigned to ${unit.name} unit`;
      const email = {
        body: {
            name: capitalize(user.name),
            intro: introAdditional,
            action: {
                instructions: 'to go to your unit or to write what is on your mind and also comment on fellow unit member posts, please click the link below',
                button: {
                    text: 'View Unit',
                    link: url,
                    color: 'blue',
                },
              },
              outro: 'Need help, or have questions? Please contact us at https://google.com',
        },
    }
    return mailgen.generate(email)
}

export const passwordResetTemplate = (name, url) => {
    let introAdditional;
    introAdditional = `You have received this email because a password reset request for your account was received`
     const email = {
        body: {
            name: capitalize(name),
            intro: introAdditional,
            action: {
                instructions: 'for your password reset please click the reset password button below',
                button: {
                    text: 'reset password',
                    link: url,
                    color: '#DC4D2F',
                },
             },
             outro: 'If you did not request a password reset. No further action is required on your part',
        },
    }
    return mailgen.generate(email)
}

