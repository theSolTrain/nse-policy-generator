'use client'

import { steps } from './steps'

type Props = {
  currentStep: number
}

export default function Stepper({ currentStep }: Props) {
  return (
    <ol className="stepper">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        
        return (
          <li
            key={step.id}
            className={`stepper__item ${isCurrent ? 'stepper__item--current' : ''} ${isCompleted ? 'stepper__item--completed' : ''}`}
          >
            <span className="stepper__item-circle"></span>
            <span className="stepper__item-title">{step.title}</span>
          </li>
        )
      })}
    </ol>
  )
}
