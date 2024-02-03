import { Link } from 'react-router-dom'
import { Input } from './'

const AuthLayout = ({ fields, button, link }) => {
  return (
    <div className='auth-container center' >
      <div className='auth-wrapper center' >
        <h2>{button.content} Page</h2>
        <div className='auth-inputs-container v-center'>
          {Object.entries(fields).map((field, idx) => {
            return (
              <div key={idx} className="inputs v-center">
                <Input {...field[1]} placeHolder={
                  field[1].type === 'password' ?
                    sperateWordsByUpperCase(field[0]) :
                    field[0]
                } />
              </div>
            )
          })}
        </div>
        <div className='auth-button'><button onClick={button.action}>{button.content}</button></div>
        <Link to={link.href}>{link.content.toLowerCase()}</Link>
      </div>
    </div>
  )
}

const sperateWordsByUpperCase = (string) => {
  const foundChar = Array.from(string).find(char => char === char.toUpperCase())

  return string.replace(foundChar, ` ${foundChar?.toLowerCase()}`)
}

export default AuthLayout