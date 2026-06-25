import { forwardRef } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'solid' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonColor = 'primary'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  color?: ButtonColor
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never
  }

type ButtonAsAnchor = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    { variant = 'solid', size = 'md', color = 'primary', className, children, ...rest },
    ref
  ) {
    const classes = [
      styles.btn,
      styles[variant],
      styles[size],
      styles[color],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    if ('href' in rest && rest.href !== undefined) {
      const { href, ...anchorRest } = rest as ButtonAsAnchor
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorRest}
        >
          {children}
        </a>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(rest as ButtonAsButton)}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
