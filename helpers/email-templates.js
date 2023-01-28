module.exports = {
  confirm: (email, username) => ({
    subject: "Confirmation Email ✔",
    html: `
    <p>Hi ${username} we are glad to have you registred with Seeking4Sports,</p>
    <p>Please confirm your email clicking on the following link:</p>
    <a href='${process.env.CLIENT_ORIGIN}/confirming_email/${email}/${username}'>
    click to confirm email
    </a>
    <p>Regards</p>
    <p>Seeking4Sports</p>
    `,
  }),

  resetPassword: (newPassword) => ({
    subject: "Reset Password ✔",
    html: `
    <p>That is your new password: <strong>${newPassword}</strong></p>
    <p>Go back to the website and login with your new temporary password and make sure to configure a new password once you are logged in.</p>
    <p>Login: <a href='${process.env.CLIENT_ORIGIN}/login'>click here</a></p>
    <p>Regards</p>
    <p>Seeking4Sports</p>
    `,
  }),
};
