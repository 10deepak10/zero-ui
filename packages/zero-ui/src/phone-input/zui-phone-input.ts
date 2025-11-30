import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'zui-phone-input': ZuiPhoneInput;
  }
}

// Comprehensive list of countries
const ALL_COUNTRIES = [
  { code: 'AF', dial: '+93', flag: '🇦🇫', name: 'Afghanistan', lengths: [9] },
  { code: 'AL', dial: '+355', flag: '🇦🇱', name: 'Albania', lengths: [8, 9] },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', name: 'Algeria', lengths: [9] },
  { code: 'AS', dial: '+1-684', flag: '🇦🇸', name: 'American Samoa', lengths: [7] },
  { code: 'AD', dial: '+376', flag: '🇦🇩', name: 'Andorra', lengths: [6] },
  { code: 'AO', dial: '+244', flag: '🇦🇴', name: 'Angola', lengths: [9] },
  { code: 'AI', dial: '+1-264', flag: '🇦🇮', name: 'Anguilla', lengths: [7] },
  { code: 'AQ', dial: '+672', flag: '🇦🇶', name: 'Antarctica', lengths: [6] },
  { code: 'AG', dial: '+1-268', flag: '🇦🇬', name: 'Antigua and Barbuda', lengths: [7] },
  { code: 'AR', dial: '+54', flag: '🇦🇷', name: 'Argentina', lengths: [10] },
  { code: 'AM', dial: '+374', flag: '🇦🇲', name: 'Armenia', lengths: [8] },
  { code: 'AW', dial: '+297', flag: '🇦🇼', name: 'Aruba', lengths: [7] },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia', lengths: [9] },
  { code: 'AT', dial: '+43', flag: '🇦🇹', name: 'Austria', lengths: [10, 11] },
  { code: 'AZ', dial: '+994', flag: '🇦🇿', name: 'Azerbaijan', lengths: [9] },
  { code: 'BS', dial: '+1-242', flag: '🇧🇸', name: 'Bahamas', lengths: [7] },
  { code: 'BH', dial: '+973', flag: '🇧🇭', name: 'Bahrain', lengths: [8] },
  { code: 'BD', dial: '+880', flag: '🇧🇩', name: 'Bangladesh', lengths: [10] },
  { code: 'BB', dial: '+1-246', flag: '🇧🇧', name: 'Barbados', lengths: [7] },
  { code: 'BY', dial: '+375', flag: '🇧🇾', name: 'Belarus', lengths: [9] },
  { code: 'BE', dial: '+32', flag: '🇧🇪', name: 'Belgium', lengths: [9] },
  { code: 'BZ', dial: '+501', flag: '🇧🇿', name: 'Belize', lengths: [7] },
  { code: 'BJ', dial: '+229', flag: '🇧🇯', name: 'Benin', lengths: [8] },
  { code: 'BM', dial: '+1-441', flag: '🇧🇲', name: 'Bermuda', lengths: [7] },
  { code: 'BT', dial: '+975', flag: '🇧🇹', name: 'Bhutan', lengths: [8] },
  { code: 'BO', dial: '+591', flag: '🇧🇴', name: 'Bolivia', lengths: [8] },
  { code: 'BA', dial: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina', lengths: [8] },
  { code: 'BW', dial: '+267', flag: '🇧🇼', name: 'Botswana', lengths: [7, 8] },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brazil', lengths: [10, 11] },
  { code: 'IO', dial: '+246', flag: '🇮🇴', name: 'British Indian Ocean Territory', lengths: [7] },
  { code: 'VG', dial: '+1-284', flag: '🇻🇬', name: 'British Virgin Islands', lengths: [7] },
  { code: 'BN', dial: '+673', flag: '🇧🇳', name: 'Brunei', lengths: [7] },
  { code: 'BG', dial: '+359', flag: '🇧🇬', name: 'Bulgaria', lengths: [8, 9] },
  { code: 'BF', dial: '+226', flag: '🇧🇫', name: 'Burkina Faso', lengths: [8] },
  { code: 'BI', dial: '+257', flag: '🇧🇮', name: 'Burundi', lengths: [8] },
  { code: 'KH', dial: '+855', flag: '🇰🇭', name: 'Cambodia', lengths: [8, 9] },
  { code: 'CM', dial: '+237', flag: '🇨🇲', name: 'Cameroon', lengths: [9] },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada', lengths: [10] },
  { code: 'CV', dial: '+238', flag: '🇨🇻', name: 'Cape Verde', lengths: [7] },
  { code: 'KY', dial: '+1-345', flag: '🇰🇾', name: 'Cayman Islands', lengths: [7] },
  { code: 'CF', dial: '+236', flag: '🇨🇫', name: 'Central African Republic', lengths: [8] },
  { code: 'TD', dial: '+235', flag: '🇹🇩', name: 'Chad', lengths: [8] },
  { code: 'CL', dial: '+56', flag: '🇨🇱', name: 'Chile', lengths: [9] },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China', lengths: [11] },
  { code: 'CX', dial: '+61', flag: '🇨🇽', name: 'Christmas Island', lengths: [9] },
  { code: 'CC', dial: '+61', flag: '🇨🇨', name: 'Cocos Islands', lengths: [9] },
  { code: 'CO', dial: '+57', flag: '🇨🇴', name: 'Colombia', lengths: [10] },
  { code: 'KM', dial: '+269', flag: '🇰🇲', name: 'Comoros', lengths: [7] },
  { code: 'CK', dial: '+682', flag: '🇨🇰', name: 'Cook Islands', lengths: [5] },
  { code: 'CR', dial: '+506', flag: '🇨🇷', name: 'Costa Rica', lengths: [8] },
  { code: 'HR', dial: '+385', flag: '🇭🇷', name: 'Croatia', lengths: [8, 9] },
  { code: 'CU', dial: '+53', flag: '🇨🇺', name: 'Cuba', lengths: [8] },
  { code: 'CW', dial: '+599', flag: '🇨🇼', name: 'Curacao', lengths: [7, 8] },
  { code: 'CY', dial: '+357', flag: '🇨🇾', name: 'Cyprus', lengths: [8] },
  { code: 'CZ', dial: '+420', flag: '🇨🇿', name: 'Czech Republic', lengths: [9] },
  { code: 'CD', dial: '+243', flag: '🇨🇩', name: 'Democratic Republic of the Congo', lengths: [9] },
  { code: 'DK', dial: '+45', flag: '🇩🇰', name: 'Denmark', lengths: [8] },
  { code: 'DJ', dial: '+253', flag: '🇩🇯', name: 'Djibouti', lengths: [8] },
  { code: 'DM', dial: '+1-767', flag: '🇩🇲', name: 'Dominica', lengths: [7] },
  { code: 'DO', dial: '+1-809', flag: '🇩🇴', name: 'Dominican Republic', lengths: [10] },
  { code: 'TL', dial: '+670', flag: '🇹🇱', name: 'East Timor', lengths: [8] },
  { code: 'EC', dial: '+593', flag: '🇪🇨', name: 'Ecuador', lengths: [9] },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egypt', lengths: [10] },
  { code: 'SV', dial: '+503', flag: '🇸🇻', name: 'El Salvador', lengths: [8] },
  { code: 'GQ', dial: '+240', flag: '🇬🇶', name: 'Equatorial Guinea', lengths: [9] },
  { code: 'ER', dial: '+291', flag: '🇪🇷', name: 'Eritrea', lengths: [7] },
  { code: 'EE', dial: '+372', flag: '🇪🇪', name: 'Estonia', lengths: [7, 8] },
  { code: 'ET', dial: '+251', flag: '🇪🇹', name: 'Ethiopia', lengths: [9] },
  { code: 'FK', dial: '+500', flag: '🇫🇰', name: 'Falkland Islands', lengths: [5] },
  { code: 'FO', dial: '+298', flag: '🇫🇴', name: 'Faroe Islands', lengths: [6] },
  { code: 'FJ', dial: '+679', flag: '🇫🇯', name: 'Fiji', lengths: [7] },
  { code: 'FI', dial: '+358', flag: '🇫🇮', name: 'Finland', lengths: [5, 6, 7, 8, 9, 10] },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France', lengths: [9] },
  { code: 'PF', dial: '+689', flag: '🇵🇫', name: 'French Polynesia', lengths: [6] },
  { code: 'GA', dial: '+241', flag: '🇬🇦', name: 'Gabon', lengths: [7] },
  { code: 'GM', dial: '+220', flag: '🇬🇲', name: 'Gambia', lengths: [7] },
  { code: 'GE', dial: '+995', flag: '🇬🇪', name: 'Georgia', lengths: [9] },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany', lengths: [10, 11] },
  { code: 'GH', dial: '+233', flag: '🇬🇭', name: 'Ghana', lengths: [9] },
  { code: 'GI', dial: '+350', flag: '🇬🇮', name: 'Gibraltar', lengths: [8] },
  { code: 'GR', dial: '+30', flag: '🇬🇷', name: 'Greece', lengths: [10] },
  { code: 'GL', dial: '+299', flag: '🇬🇱', name: 'Greenland', lengths: [6] },
  { code: 'GD', dial: '+1-473', flag: '🇬🇩', name: 'Grenada', lengths: [7] },
  { code: 'GU', dial: '+1-671', flag: '🇬🇺', name: 'Guam', lengths: [7] },
  { code: 'GT', dial: '+502', flag: '🇬🇹', name: 'Guatemala', lengths: [8] },
  { code: 'GG', dial: '+44-1481', flag: '🇬🇬', name: 'Guernsey', lengths: [10] },
  { code: 'GN', dial: '+224', flag: '🇬🇳', name: 'Guinea', lengths: [9] },
  { code: 'GW', dial: '+245', flag: '🇬🇼', name: 'Guinea-Bissau', lengths: [7] },
  { code: 'GY', dial: '+592', flag: '🇬🇾', name: 'Guyana', lengths: [7] },
  { code: 'HT', dial: '+509', flag: '🇭🇹', name: 'Haiti', lengths: [8] },
  { code: 'HN', dial: '+504', flag: '🇭🇳', name: 'Honduras', lengths: [8] },
  { code: 'HK', dial: '+852', flag: '🇭🇰', name: 'Hong Kong', lengths: [8] },
  { code: 'HU', dial: '+36', flag: '🇭🇺', name: 'Hungary', lengths: [9] },
  { code: 'IS', dial: '+354', flag: '🇮🇸', name: 'Iceland', lengths: [7] },
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India', lengths: [10] },
  { code: 'ID', dial: '+62', flag: '🇮🇩', name: 'Indonesia', lengths: [9, 10, 11] },
  { code: 'IR', dial: '+98', flag: '🇮🇷', name: 'Iran', lengths: [10] },
  { code: 'IQ', dial: '+964', flag: '🇮🇶', name: 'Iraq', lengths: [10] },
  { code: 'IE', dial: '+353', flag: '🇮🇪', name: 'Ireland', lengths: [9] },
  { code: 'IM', dial: '+44-1624', flag: '🇮🇲', name: 'Isle of Man', lengths: [10] },
  { code: 'IL', dial: '+972', flag: '🇮🇱', name: 'Israel', lengths: [9] },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italy', lengths: [10] },
  { code: 'CI', dial: '+225', flag: '🇨🇮', name: 'Ivory Coast', lengths: [8] },
  { code: 'JM', dial: '+1-876', flag: '🇯🇲', name: 'Jamaica', lengths: [7] },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japan', lengths: [10] },
  { code: 'JE', dial: '+44-1534', flag: '🇯🇪', name: 'Jersey', lengths: [10] },
  { code: 'JO', dial: '+962', flag: '🇯🇴', name: 'Jordan', lengths: [9] },
  { code: 'KZ', dial: '+7', flag: '🇰🇿', name: 'Kazakhstan', lengths: [10] },
  { code: 'KE', dial: '+254', flag: '🇰🇪', name: 'Kenya', lengths: [9] },
  { code: 'KI', dial: '+686', flag: '🇰🇮', name: 'Kiribati', lengths: [8] },
  { code: 'XK', dial: '+383', flag: '🇽🇰', name: 'Kosovo', lengths: [8] },
  { code: 'KW', dial: '+965', flag: '🇰🇼', name: 'Kuwait', lengths: [8] },
  { code: 'KG', dial: '+996', flag: '🇰🇬', name: 'Kyrgyzstan', lengths: [9] },
  { code: 'LA', dial: '+856', flag: '🇱🇦', name: 'Laos', lengths: [8] },
  { code: 'LV', dial: '+371', flag: '🇱🇻', name: 'Latvia', lengths: [8] },
  { code: 'LB', dial: '+961', flag: '🇱🇧', name: 'Lebanon', lengths: [7, 8] },
  { code: 'LS', dial: '+266', flag: '🇱🇸', name: 'Lesotho', lengths: [8] },
  { code: 'LR', dial: '+231', flag: '🇱🇷', name: 'Liberia', lengths: [7, 8] },
  { code: 'LY', dial: '+218', flag: '🇱🇾', name: 'Libya', lengths: [9] },
  { code: 'LI', dial: '+423', flag: '🇱🇮', name: 'Liechtenstein', lengths: [7] },
  { code: 'LT', dial: '+370', flag: '🇱🇹', name: 'Lithuania', lengths: [8] },
  { code: 'LU', dial: '+352', flag: '🇱🇺', name: 'Luxembourg', lengths: [9] },
  { code: 'MO', dial: '+853', flag: '🇲🇴', name: 'Macau', lengths: [8] },
  { code: 'MK', dial: '+389', flag: '🇲🇰', name: 'Macedonia', lengths: [8] },
  { code: 'MG', dial: '+261', flag: '🇲🇬', name: 'Madagascar', lengths: [9] },
  { code: 'MW', dial: '+265', flag: '🇲🇼', name: 'Malawi', lengths: [9] },
  { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malaysia', lengths: [9, 10] },
  { code: 'MV', dial: '+960', flag: '🇲🇻', name: 'Maldives', lengths: [7] },
  { code: 'ML', dial: '+223', flag: '🇲🇱', name: 'Mali', lengths: [8] },
  { code: 'MT', dial: '+356', flag: '🇲🇹', name: 'Malta', lengths: [8] },
  { code: 'MH', dial: '+692', flag: '🇲🇭', name: 'Marshall Islands', lengths: [7] },
  { code: 'MR', dial: '+222', flag: '🇲🇷', name: 'Mauritania', lengths: [8] },
  { code: 'MU', dial: '+230', flag: '🇲🇺', name: 'Mauritius', lengths: [8] },
  { code: 'YT', dial: '+262', flag: '🇾🇹', name: 'Mayotte', lengths: [9] },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'Mexico', lengths: [10] },
  { code: 'FM', dial: '+691', flag: '🇫🇲', name: 'Micronesia', lengths: [7] },
  { code: 'MD', dial: '+373', flag: '🇲🇩', name: 'Moldova', lengths: [8] },
  { code: 'MC', dial: '+377', flag: '🇲🇨', name: 'Monaco', lengths: [8, 9] },
  { code: 'MN', dial: '+976', flag: '🇲🇳', name: 'Mongolia', lengths: [8] },
  { code: 'ME', dial: '+382', flag: '🇲🇪', name: 'Montenegro', lengths: [8] },
  { code: 'MS', dial: '+1-664', flag: '🇲🇸', name: 'Montserrat', lengths: [7] },
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'Morocco', lengths: [9] },
  { code: 'MZ', dial: '+258', flag: '🇲🇿', name: 'Mozambique', lengths: [9] },
  { code: 'MM', dial: '+95', flag: '🇲🇲', name: 'Myanmar', lengths: [8, 9] },
  { code: 'NA', dial: '+264', flag: '🇳🇦', name: 'Namibia', lengths: [9] },
  { code: 'NR', dial: '+674', flag: '🇳🇷', name: 'Nauru', lengths: [7] },
  { code: 'NP', dial: '+977', flag: '🇳🇵', name: 'Nepal', lengths: [10] },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Netherlands', lengths: [9] },
  { code: 'NC', dial: '+687', flag: '🇳🇨', name: 'New Caledonia', lengths: [6] },
  { code: 'NZ', dial: '+64', flag: '🇳🇿', name: 'New Zealand', lengths: [8, 9, 10] },
  { code: 'NI', dial: '+505', flag: '🇳🇮', name: 'Nicaragua', lengths: [8] },
  { code: 'NE', dial: '+227', flag: '🇳🇪', name: 'Niger', lengths: [8] },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria', lengths: [10] },
  { code: 'NU', dial: '+683', flag: '🇳🇺', name: 'Niue', lengths: [4] },
  { code: 'NF', dial: '+672', flag: '🇳🇫', name: 'Norfolk Island', lengths: [5] },
  { code: 'KP', dial: '+850', flag: '🇰🇵', name: 'North Korea', lengths: [8, 10] },
  { code: 'MP', dial: '+1-670', flag: '🇲🇵', name: 'Northern Mariana Islands', lengths: [7] },
  { code: 'NO', dial: '+47', flag: '🇳🇴', name: 'Norway', lengths: [8] },
  { code: 'OM', dial: '+968', flag: '🇴🇲', name: 'Oman', lengths: [8] },
  { code: 'PK', dial: '+92', flag: '🇵🇰', name: 'Pakistan', lengths: [10] },
  { code: 'PW', dial: '+680', flag: '🇵🇼', name: 'Palau', lengths: [7] },
  { code: 'PS', dial: '+970', flag: '🇵🇸', name: 'Palestine', lengths: [9] },
  { code: 'PA', dial: '+507', flag: '🇵🇦', name: 'Panama', lengths: [7, 8] },
  { code: 'PG', dial: '+675', flag: '🇵🇬', name: 'Papua New Guinea', lengths: [8] },
  { code: 'PY', dial: '+595', flag: '🇵🇾', name: 'Paraguay', lengths: [9] },
  { code: 'PE', dial: '+51', flag: '🇵🇪', name: 'Peru', lengths: [9] },
  { code: 'PH', dial: '+63', flag: '🇵🇭', name: 'Philippines', lengths: [10] },
  { code: 'PN', dial: '+64', flag: '🇵🇳', name: 'Pitcairn', lengths: [2] },
  { code: 'PL', dial: '+48', flag: '🇵🇱', name: 'Poland', lengths: [9] },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal', lengths: [9] },
  { code: 'PR', dial: '+1-787', flag: '🇵🇷', name: 'Puerto Rico', lengths: [7] },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar', lengths: [8] },
  { code: 'CG', dial: '+242', flag: '🇨🇬', name: 'Republic of the Congo', lengths: [9] },
  { code: 'RE', dial: '+262', flag: '🇷🇪', name: 'Reunion', lengths: [9] },
  { code: 'RO', dial: '+40', flag: '🇷🇴', name: 'Romania', lengths: [9] },
  { code: 'RU', dial: '+7', flag: '🇷🇺', name: 'Russia', lengths: [10] },
  { code: 'RW', dial: '+250', flag: '🇷🇼', name: 'Rwanda', lengths: [9] },
  { code: 'BL', dial: '+590', flag: '🇧🇱', name: 'Saint Barthelemy', lengths: [9] },
  { code: 'SH', dial: '+290', flag: '🇸🇭', name: 'Saint Helena', lengths: [4] },
  { code: 'KN', dial: '+1-869', flag: '🇰🇳', name: 'Saint Kitts and Nevis', lengths: [7] },
  { code: 'LC', dial: '+1-758', flag: '🇱🇨', name: 'Saint Lucia', lengths: [7] },
  { code: 'MF', dial: '+590', flag: '🇲🇫', name: 'Saint Martin', lengths: [9] },
  { code: 'PM', dial: '+508', flag: '🇵🇲', name: 'Saint Pierre and Miquelon', lengths: [6] },
  { code: 'VC', dial: '+1-784', flag: '🇻🇨', name: 'Saint Vincent and the Grenadines', lengths: [7] },
  { code: 'WS', dial: '+685', flag: '🇼🇸', name: 'Samoa', lengths: [7] },
  { code: 'SM', dial: '+378', flag: '🇸🇲', name: 'San Marino', lengths: [10] },
  { code: 'ST', dial: '+239', flag: '🇸🇹', name: 'Sao Tome and Principe', lengths: [7] },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia', lengths: [9] },
  { code: 'SN', dial: '+221', flag: '🇸🇳', name: 'Senegal', lengths: [9] },
  { code: 'RS', dial: '+381', flag: '🇷🇸', name: 'Serbia', lengths: [8, 9] },
  { code: 'SC', dial: '+248', flag: '🇸🇨', name: 'Seychelles', lengths: [7] },
  { code: 'SL', dial: '+232', flag: '🇸🇱', name: 'Sierra Leone', lengths: [8] },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapore', lengths: [8] },
  { code: 'SX', dial: '+1-721', flag: '🇸🇽', name: 'Sint Maarten', lengths: [7] },
  { code: 'SK', dial: '+421', flag: '🇸🇰', name: 'Slovakia', lengths: [9] },
  { code: 'SI', dial: '+386', flag: '🇸🇮', name: 'Slovenia', lengths: [8] },
  { code: 'SB', dial: '+677', flag: '🇸🇧', name: 'Solomon Islands', lengths: [7] },
  { code: 'SO', dial: '+252', flag: '🇸🇴', name: 'Somalia', lengths: [8] },
  { code: 'ZA', dial: '+27', flag: '🇿🇦', name: 'South Africa', lengths: [9] },
  { code: 'KR', dial: '+82', flag: '🇰🇷', name: 'South Korea', lengths: [9, 10] },
  { code: 'SS', dial: '+211', flag: '🇸🇸', name: 'South Sudan', lengths: [9] },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'Spain', lengths: [9] },
  { code: 'LK', dial: '+94', flag: '🇱🇰', name: 'Sri Lanka', lengths: [9] },
  { code: 'SD', dial: '+249', flag: '🇸🇩', name: 'Sudan', lengths: [9] },
  { code: 'SR', dial: '+597', flag: '🇸🇷', name: 'Suriname', lengths: [7] },
  { code: 'SJ', dial: '+47', flag: '🇸🇯', name: 'Svalbard and Jan Mayen', lengths: [8] },
  { code: 'SZ', dial: '+268', flag: '🇸🇿', name: 'Swaziland', lengths: [8] },
  { code: 'SE', dial: '+46', flag: '🇸🇪', name: 'Sweden', lengths: [7, 9, 10] },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Switzerland', lengths: [9] },
  { code: 'SY', dial: '+963', flag: '🇸🇾', name: 'Syria', lengths: [9] },
  { code: 'TW', dial: '+886', flag: '🇹🇼', name: 'Taiwan', lengths: [9] },
  { code: 'TJ', dial: '+992', flag: '🇹🇯', name: 'Tajikistan', lengths: [9] },
  { code: 'TZ', dial: '+255', flag: '🇹🇿', name: 'Tanzania', lengths: [9] },
  { code: 'TH', dial: '+66', flag: '🇹🇭', name: 'Thailand', lengths: [9] },
  { code: 'TG', dial: '+228', flag: '🇹🇬', name: 'Togo', lengths: [8] },
  { code: 'TK', dial: '+690', flag: '🇹🇰', name: 'Tokelau', lengths: [4] },
  { code: 'TO', dial: '+676', flag: '🇹🇴', name: 'Tonga', lengths: [7] },
  { code: 'TT', dial: '+1-868', flag: '🇹🇹', name: 'Trinidad and Tobago', lengths: [7] },
  { code: 'TN', dial: '+216', flag: '🇹🇳', name: 'Tunisia', lengths: [8] },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turkey', lengths: [10] },
  { code: 'TM', dial: '+993', flag: '🇹🇲', name: 'Turkmenistan', lengths: [8] },
  { code: 'TC', dial: '+1-649', flag: '🇹🇨', name: 'Turks and Caicos Islands', lengths: [7] },
  { code: 'TV', dial: '+688', flag: '🇹🇻', name: 'Tuvalu', lengths: [5] },
  { code: 'VI', dial: '+1-340', flag: '🇻🇮', name: 'U.S. Virgin Islands', lengths: [7] },
  { code: 'UG', dial: '+256', flag: '🇺🇬', name: 'Uganda', lengths: [9] },
  { code: 'UA', dial: '+380', flag: '🇺🇦', name: 'Ukraine', lengths: [9] },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'United Arab Emirates', lengths: [9] },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom', lengths: [10, 11] },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States', lengths: [10] },
  { code: 'UY', dial: '+598', flag: '🇺🇾', name: 'Uruguay', lengths: [8] },
  { code: 'UZ', dial: '+998', flag: '🇺🇿', name: 'Uzbekistan', lengths: [9] },
  { code: 'VU', dial: '+678', flag: '🇻🇺', name: 'Vanuatu', lengths: [7] },
  { code: 'VA', dial: '+379', flag: '🇻🇦', name: 'Vatican', lengths: [10] },
  { code: 'VE', dial: '+58', flag: '🇻🇪', name: 'Venezuela', lengths: [10] },
  { code: 'VN', dial: '+84', flag: '🇻🇳', name: 'Vietnam', lengths: [9] },
  { code: 'WF', dial: '+681', flag: '🇼🇫', name: 'Wallis and Futuna', lengths: [6] },
  { code: 'EH', dial: '+212', flag: '🇪🇭', name: 'Western Sahara', lengths: [9] },
  { code: 'YE', dial: '+967', flag: '🇾🇪', name: 'Yemen', lengths: [9] },
  { code: 'ZM', dial: '+260', flag: '🇿🇲', name: 'Zambia', lengths: [9] },
  { code: 'ZW', dial: '+263', flag: '🇿🇼', name: 'Zimbabwe', lengths: [9] },
];

@customElement('zui-phone-input')
export class ZuiPhoneInput extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .container {
      display: flex;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      overflow: hidden;
      transition: all 0.2s;
      background: #fff;
    }

    .container:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .container.invalid {
      border-color: #ef4444;
    }

    .container.invalid:focus-within {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    select {
      appearance: none;
      background: #f9fafb;
      border: none;
      border-right: 1px solid #e5e7eb;
      padding: 8px 12px;
      font-size: 1rem;
      color: #111827;
      cursor: pointer;
      outline: none;
      min-width: 80px;
      height: 42px;
    }

    select:hover {
      background: #f3f4f6;
    }

    input {
      border: none;
      padding: 8px 12px;
      font-size: 1rem;
      color: #111827;
      background: #fff;
      outline: none;
      width: 100%;
      min-width: 150px;
      height: 42px;
      box-sizing: border-box;
    }

    input::placeholder {
      color: #9ca3af;
    }
  `;

  @property({ type: String })
  value = '';

  @property({ type: Array })
  allowedCountries: string[] = [];

  @state()
  private _countryCode = '+1';

  @state()
  private _phoneNumber = '';

  @state()
  private _isValid = false;

  @state()
  private _touched = false;

  private get _filteredCountries() {
    if (!this.allowedCountries || this.allowedCountries.length === 0) {
      return ALL_COUNTRIES;
    }
    return ALL_COUNTRIES.filter(c => this.allowedCountries.includes(c.code));
  }

  firstUpdated() {
    // Ensure initial country code is valid for filtered list
    const countries = this._filteredCountries;
    if (countries.length > 0 && !countries.find(c => c.dial === this._countryCode)) {
      this._countryCode = countries[0].dial;
      this.requestUpdate();
    }
    // Initial validation
    this._validate();
  }

  private _validate() {
    const country = ALL_COUNTRIES.find(c => c.dial === this._countryCode);
    // Default to 7-15 digits if no specific lengths defined
    const validLengths = country && 'lengths' in country ? (country as any).lengths : [7, 8, 9, 10, 11, 12, 13, 14, 15];
    
    if (!this._phoneNumber) {
      this._isValid = false;
      return;
    }

    this._isValid = validLengths.includes(this._phoneNumber.length);
  }

  private _handleCountryChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this._countryCode = select.value;
    this._validate();
    this._emitChange();
  }

  private _handlePhoneInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    // Allow only numbers and spaces/dashes
    const val = input.value.replace(/[^\d\s-]/g, '');
    this._phoneNumber = val;
    input.value = val; // Update input to filtered value
    
    this._touched = true;
    this._validate();
    this._emitChange();
  }

  private _handleBlur() {
    this._touched = true;
    this.requestUpdate();
  }

  private _emitChange() {
    const fullValue = `${this._countryCode} ${this._phoneNumber}`.trim();
    this.value = fullValue;
    this.dispatchEvent(new CustomEvent('zui-phone-change', {
      detail: { 
        value: fullValue,
        countryCode: this._countryCode,
        phoneNumber: this._phoneNumber,
        isValid: this._isValid
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const isInvalid = !this._isValid && this._touched;
    return html`
      <div class="container ${isInvalid ? 'invalid' : ''}">
        <select @change=${this._handleCountryChange} .value=${this._countryCode}>
          ${this._filteredCountries.map(c => html`
            <option value=${c.dial}>${c.flag} ${c.dial}</option>
          `)}
        </select>
        <input
          type="tel"
          placeholder="Phone number"
          .value=${this._phoneNumber}
          @input=${this._handlePhoneInput}
          @blur=${this._handleBlur}
        />
      </div>
    `;
  }
}
