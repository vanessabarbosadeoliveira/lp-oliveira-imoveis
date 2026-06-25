import styles from './Divider.module.css'

export interface DividerProps {
  className?: string
}

export default function Divider({ className }: DividerProps) {
  const classes = [styles.divider, className].filter(Boolean).join(' ')
  return <hr className={classes} aria-hidden="true" />
}
