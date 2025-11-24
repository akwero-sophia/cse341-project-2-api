const express = require('express');
const router = express.Router();
const passport = require('passport');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     OAuth2:
 *       type: oauth2
 *       flows:
 *         authorizationCode:
 *           authorizationUrl: /auth/google
 *           tokenUrl: /auth/google/callback
 *           scopes:
 *             profile: Access user profile
 *             email: Access user email
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     description: Redirects to Google OAuth login page
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     description: Handles the callback from Google OAuth
 *     responses:
 *       302:
 *         description: Redirect after successful authentication
 */
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth/login/failed' 
  }),
  (req, res) => {
    // Successful authentication
    res.redirect('/auth/login/success');
  }
);

/**
 * @swagger
 * /auth/login/success:
 *   get:
 *     summary: Login success response
 *     tags: [Authentication]
 *     description: Returns success message after successful login
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Not authenticated
 */
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

/**
 * @swagger
 * /auth/login/failed:
 *   get:
 *     summary: Login failed response
 *     tags: [Authentication]
 *     description: Returns error message when login fails
 *     responses:
 *       401:
 *         description: Login failed
 */
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Login failed'
  });
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Logs out the current user
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ 
      success: true,
      message: 'Successfully logged out' 
    });
  });
});

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     description: Returns the currently logged-in user (Protected route)
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       401:
 *         description: Not authenticated
 */
router.get('/user', (req, res) => {
  if (req.user) {
    res.status(200).json({
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email
      }
    });
  } else {
    res.status(401).json({ 
      error: 'Not authenticated',
      loginUrl: '/auth/google'
    });
  }
});

module.exports = router;