import PortfolioContainer from './Portfolio'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import girl from '../../public/images/otaku_girl.png'

export default {
    title: 'portfolio_container',
    components: PortfolioContainer
} as ComponentMeta<typeof PortfolioContainer>

const Template: ComponentStory<typeof PortfolioContainer> = (args) => {
    return <PortfolioContainer {...args} />
}

export const Primary = Template.bind({})
Primary.args = {
    _id: undefined,
    image_preview_url: String(girl),
    username: 'John Doe',
    work_name: 'Nextjs-Start-App',
    review_avg: 5
}
