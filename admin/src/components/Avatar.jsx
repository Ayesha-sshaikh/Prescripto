// Round picture: the real photo if there is one, otherwise the first letter of the name
const Avatar = ({ src, name = '?', size = 32 }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover bg-indigo-50"
      />
    )
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-indigo-100 text-primary flex items-center justify-center font-semibold shrink-0"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default Avatar
