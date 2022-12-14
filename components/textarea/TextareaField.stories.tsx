import TextareaField from './TextareaField'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, fireEvent } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
import React, { useState } from 'react'

export default {
    title: 'TextareaField_container',
    components: TextareaField,
    decorators: [
        (Story) => (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Story />
            </div>
        )
    ],
    argTypes: {
        field_width: {
            options: [200, 300, 400],
            control: { type: 'select' }
        },
        field_height: {
            options: [100, 200, 300],
            control: { type: 'select' }
        }
    },
    onChange: {
        action: 'changed'
    }
} as ComponentMeta<typeof TextareaField>

const Template: ComponentStory<typeof TextareaField> = (args) => {
    const [value, setValue] = useState<string>('')

    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!e.target.value) setValue('')

        setValue(e.target.value)
    }

    return (
        <TextareaField
            {...args}
            value={value}
            onChange={(event) => onChangeHandler(event)}
        />
    )
}

export const Primary = Template.bind({})
Primary.args = {
    field_width: 300,
    field_height: 150
}
Primary.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const textareaElement = canvas.getByRole('textarea_field')
    expect(textareaElement).toBeInTheDocument()
    await fireEvent.change(textareaElement, {
        target: {
            value: 'sample text sample text'
        }
    })
}

export const Large = Template.bind({})
Large.args = {
    field_height: 200,
    field_width: 400
}

export const Middle = Template.bind({})
Middle.args = {
    field_height: 150,
    field_width: 300
}
