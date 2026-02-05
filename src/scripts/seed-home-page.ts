import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const homePageContent = {
  en: {
    section1: {
      tagline: 'Welcome to KOTO',
      introduction:
        "KOTO is Vietnam's first social enterprise, where <span style='color: var(--r1-orange-2)'>business and social impact intersect.</span> We empower youth through hands-on vocational training, providing them with the opportunities and skills needed to thrive in the hospitality industry and beyond",
      dreamSchoolBanner: {
        title: 'Dream\nSchool',
        subtitle: 'Grand Opening',
        time: 'Friday, 07.11.2025\n11:00 AM - 08:30 PM',
        location: 'Phat Tich – Bac Ninh',
      },
      cards: [
        {
          id: '01',
          tagline: 'Foundation',
          title: 'Changing lives',
          paragraph:
            'KOTO Foundation empowers at-risk youth through hands-on hospitality training, providing the skills and opportunities they need for a brighter future.',
          button: {
            text: 'Learn about our social impact',
            link: '/koto-foundation',
          },
        },
        {
          id: '02',
          tagline: 'Enterprise',
          title: 'Dine with purpose',
          paragraph:
            "KOTO's restaurant, catering services, and classes not only offer exceptional food and experiences but directly support our mission to empower youth with real-world opportunities.",
          button: {
            text: "Experience KOTO's hospitality",
            link: '/koto-enterprise',
          },
        },
      ],
    },
    section2: {
      tagline: 'The KOTO Model',
      title: 'Empowering youth through support and sustainability',
      charts: [
        {
          title: 'KOTO Alumni\n Connect',
          texts: [
            "<b style='color: var(--chart-text-color)'>Support</b>",
            "<b style='color: var(--chart-text-color)'>Support</b>",
          ],
        },
        {
          title: 'Foundation',
          texts: [
            "<b style='color: var(--chart-text-color)'>Your support:</b><br><span style='color: var(--chart-text-color)'>Donation and support</span>",
            "<b style='color: var(--chart-text-color)'>Send trainee to <br>practice</b>",
          ],
        },
        {
          title: 'Enterprise',
          texts: [
            "<b style='color: var(--chart-text-color)'>Financial support</b>",
            "<b style='color: var(--chart-text-color)'>Your support:</b><br><span style='color: var(--chart-text-color)'>Dining, services and purchases</span>",
          ],
        },
      ],
    },
    section3: {
      tagline: 'Our Valued Partners',
      title: 'Trust by visionaries',
      introduction:
        'We are deeply grateful for the support of our partners, whose contributions play a vital role in helping us empower at-risk youth and build sustainable futures for communities.',
      button: {
        text: 'View all partners',
        link: '/our-partners',
      },
      donateIntroduction:
        "Your donation directly funds KOTO's training programs, providing at-risk youth with the skills they need to succeed. By supporting our mission, you're helping transform lives, empowering young people to create a brighter future for themselves and their communities.",
      donateButton: [
        {
          text: 'Support our youth',
          link: '/koto-foundation',
        },
        {
          text: 'Explore our services',
          link: '/koto-enterprise',
        },
      ],
    },
    section4: {
      tagline: 'News and blogs',
      title: 'Stories that matter',
      button: {
        text: 'View all posts',
        link: '/news-media',
      },
      form: {
        introduction: 'Are you interested in partnering with KOTO to make a difference?',
        title: 'Send us a message',
        fields: [
          {
            label: 'Full name',
            placeholder: 'Enter your name',
          },
          {
            label: 'Email',
            placeholder: 'Enter your email address',
          },
          {
            label: 'Message',
            placeholder: '',
          },
        ],
        buttonText: 'Submit',
      },
    },
  },
  vi: {
    section1: {
      tagline: 'Chào mừng đến với KOTO',
      introduction:
        "KOTO là doanh nghiệp xã hội đầu tiên tại Việt Nam, nơi <span style='color: var(--r1-orange-2)'>kinh doanh và tác động xã hội giao thoa.</span> Chúng tôi trao quyền cho thanh thiếu niên thông qua đào tạo nghề thực hành, giúp các em có cơ hội và kỹ năng để phát triển trong ngành dịch vụ khách sạn – nhà hàng và hơn thế nữa.",
      dreamSchoolBanner: {
        title: 'Trường\nMơ ước',
        subtitle: 'Khai Trương',
        time: 'Thứ Sáu, 07.11.2025\n11:00 sáng - 08:30 tối',
        location: 'Phật Tích – Bắc Ninh',
      },
      cards: [
        {
          id: '01',
          tagline: 'Quỹ KOTO',
          title: 'Thay đổi cuộc đời',
          paragraph:
            'Quỹ KOTO trao quyền cho thanh thiếu niên có hoàn cảnh khó khăn thông qua đào tạo nghề và thực hành trong lĩnh vực dịch vụ khách sạn – nhà hàng, giúp các em có kỹ năng và cơ hội để hướng tới một tương lai tươi sáng hơn.',
          button: {
            text: 'Tìm hiểu về tác động của chúng tôi',
            link: '/vi/koto-foundation',
          },
        },
        {
          id: '02',
          tagline: 'Doanh nghiệp xã hội',
          title: 'Thưởng thức ẩm thực, lan tỏa yêu thương',
          paragraph:
            'Nhà hàng, dịch vụ tiệc và các lớp học của KOTO không chỉ mang đến những món ăn và trải nghiệm ấn tượng mà còn trực tiếp góp phần vào sứ mệnh trao quyền cho thanh niên bằng các cơ hội nghề nghiệp thực tế.',
          button: {
            text: 'Trải nghiệm dịch vụ hiếu khách của KOTO',
            link: '/vi/koto-enterprise',
          },
        },
      ],
    },
    section2: {
      tagline: 'Mô hình KOTO',
      title: 'Trao quyền cho thanh niên thông qua sự hỗ trợ và phát triển bền vững',
      charts: [
        {
          title: 'KOTO Alumni\n Connect',
          texts: [
            "<b style='color: var(--chart-text-color)'>Hỗ trợ</b>",
            "<b style='color: var(--chart-text-color)'>Hỗ trợ</b>",
          ],
        },
        {
          title: 'Foundation',
          texts: [
            "<b style='color: var(--chart-text-color)'>Hỗ trợ của bạn:</b><br><span style='color: var(--chart-text-color)'>Quyên góp và hỗ trợ</span>",
            "<b style='color: var(--chart-text-color)'>Gửi học viên đi <br>thực hành</b>",
          ],
        },
        {
          title: 'Enterprise',
          texts: [
            "<b style='color: var(--chart-text-color)'>Hỗ trợ tài chính</b>",
            "<b style='color: var(--chart-text-color)'>Hỗ trợ của bạn:</b><br><span style='color: var(--chart-text-color)'>Ẩm thực, dịch vụ và mua sắm</span>",
          ],
        },
      ],
    },
    section3: {
      tagline: 'Đối tác trân quý của chúng tôi',
      title: 'Niềm tin từ những người tiên phong',
      introduction:
        'Chúng tôi vô cùng trân trọng sự đồng hành của các đối tác, những người đã và đang đóng góp quan trọng vào hành trình trao quyền cho thanh niên có hoàn cảnh khó khăn và xây dựng tương lai bền vững cho cộng đồng.',
      button: {
        text: 'Xem tất cả đối tác',
        link: '/our-partners/vi',
      },
      donateIntroduction:
        'Khoản đóng góp của bạn trực tiếp tài trợ cho các chương trình đào tạo của KOTO, giúp các em có hoàn cảnh khó khăn trang bị kỹ năng để thành công. Khi ủng hộ sứ mệnh của chúng tôi, bạn đang góp phần thay đổi cuộc đời, trao quyền để các em kiến tạo tương lai tươi sáng cho bản thân và cộng đồng.',
      donateButton: [
        {
          text: 'Hỗ trợ học viên của chúng tôi',
          link: '/vi/koto-foundation',
        },
        {
          text: 'Khám phá các dịch vụ của chúng tôi',
          link: '/vi/koto-enterprise',
        },
      ],
    },
    section4: {
      tagline: 'Tin tức & Blog',
      title: 'Những câu chuyện đáng trân trọng',
      button: {
        text: 'Xem tất cả bài viết',
        link: '/vi/news-media',
      },
      form: {
        introduction: 'Nếu bạn quan tâm đến hợp tác cùng KOTO để tạo nên sự khác biệt',
        title: 'Gửi tin nhắn cho chúng tôi',
        fields: [
          {
            label: 'Họ và tên',
            placeholder: 'Nhập họ và tên của bạn',
          },
          {
            label: 'Dịa chỉ email',
            placeholder: 'Nhập địa chỉ email của bạn',
          },
          {
            label: 'Nội dung tin nhắn',
            placeholder: '',
          },
        ],
        buttonText: 'Gửi',
      },
    },
  },
}

async function seedHomePage() {
  try {
    console.log('Initializing Payload...')
    const payload = await getPayload({ config: configPromise })

    // Check if Home page already exists
    const existingPages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
    })

    if (existingPages.docs.length > 0) {
      console.log('Home page already exists. Updating...')
      const existingPage = existingPages.docs[0]

      // Update existing page
      await payload.update({
        collection: 'pages',
        id: existingPage.id,
        data: {
          content: homePageContent,
          status: 'published',
        },
        locale: 'en',
      })

      // Update title for English locale
      await payload.update({
        collection: 'pages',
        id: existingPage.id,
        data: {
          title: 'Home',
        },
        locale: 'en',
      })

      // Update title for Vietnamese locale
      await payload.update({
        collection: 'pages',
        id: existingPage.id,
        data: {
          title: 'Trang chủ',
        },
        locale: 'vi',
      })

      console.log('✅ Home page updated successfully!')
      console.log(`   Page ID: ${existingPage.id}`)
      console.log(`   Slug: home`)
    } else {
      console.log('Creating Home page...')

      // Get the first admin user for createdBy
      const users = await payload.find({
        collection: 'users',
        where: {
          role: {
            equals: 'admin',
          },
        },
        limit: 1,
      })

      const adminUser = users.docs[0]

      // Create the page
      const page = await payload.create({
        collection: 'pages',
        data: {
          title: 'Home',
          content: homePageContent,
          status: 'published',
          slug: 'home',
          slugLock: true,
          createdBy: adminUser?.id || undefined,
        },
        locale: 'en',
      })

      // Update title for Vietnamese locale
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: {
          title: 'Trang chủ',
        },
        locale: 'vi',
      })

      console.log('✅ Home page created successfully!')
      console.log(`   Page ID: ${page.id}`)
      console.log(`   Slug: home`)
      console.log(`   Status: published`)
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding Home page:', error)
    process.exit(1)
  }
}

// Run the seed function
seedHomePage()
