'use client'

import { steps } from './steps'

type Props = {
  currentStep: number
}

export default function Stepper({ currentStep }: Props) {
  return (
    <ol style={{ display: 'flex', gap: 16 }}>
      {steps.map((step, index) => (
        <li
          key={step.id}
          style={{
            fontWeight: index === currentStep ? 'bold' : 'normal',
            opacity: index <= currentStep ? 1 : 0.4,
          }}
        >
          {index + 1}. {step.title}
        </li>
      ))}
    </ol>
  )
}
