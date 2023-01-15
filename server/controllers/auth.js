import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'

// REGISTER USER

export const register = async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    })
    const savedUser = await newUser.save()
    res.status(StatusCodes.CREATED).json(savedUser)
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'User does not exist.' })

    const isMatch = await user.comparePassword(password)

    if (!isMatch)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Invalid email or password.' })

    const token = await user.createJWT()
    delete user.password

    res.status(StatusCodes.OK).json({ user, token })
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: err.message })
  }
}

// LOGGING IN USER
