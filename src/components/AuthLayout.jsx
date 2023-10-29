import React from 'react'
import Input from './Input'
import { Link } from 'react-router-dom'

const AuthLayout = ({ fields, button, link }) => {
  console.log()
  return (
    <div className='auth-container' >
      <div className='auth-wrapper' >
        <div>{button.content} Page</div>
        <div className='auth-inputs-container'>
          {Object.entries(fields).map((field, idx) => {
            return (
              <div key={idx} className="inputs">
                <span>
                  {field[1].type === 'password' ?
                    sperateWordsByUpperCaseChars(field[0]) :
                    field[0]}:
                </span>
                <Input {...field[1]} />
              </div>
            )
          })}
        </div>
        <div><button onClick={button.action}>{button.content}</button></div>
        <Link to={link.href}>{link.content.toLowerCase()}</Link>
      </div>
    </div>
  )
}

const sperateWordsByUpperCaseChars = (string) => {
  const foundChar = Array.from(string).find(char => char === char.toUpperCase())

  return string.replace(foundChar, ` ${foundChar?.toLowerCase()}`)
}

export default AuthLayout