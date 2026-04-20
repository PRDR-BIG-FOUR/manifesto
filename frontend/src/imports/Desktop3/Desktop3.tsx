import svgPaths from "./svg-f0wzkva7pi";

function Container1() {
  return (
    <div className="bg-[#a16749] h-[18px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[4px] py-[2px] relative size-full">
        <p className="font-['Source_Serif_4:Italic',sans-serif] font-normal italic leading-[21px] relative shrink-0 text-[14px] text-white tracking-[0.66px] whitespace-nowrap">PRDR</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[217.23px] px-[4px] top-[5px]" data-name="Link">
      <p className="font-['Inter_Tight:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121212] text-[14px] tracking-[0.5838px] uppercase whitespace-nowrap">Dashboard</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[343.23px] px-[4px] top-[5px]" data-name="Link">
      <p className="font-['Inter_Tight:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#a16749] text-[14px] tracking-[0.5838px] uppercase whitespace-nowrap">Compare</p>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[451.23px] px-[4px] top-[5px]" data-name="Link">
      <p className="font-['Inter_Tight:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121212] text-[14px] tracking-[0.5838px] uppercase whitespace-nowrap">Demography</p>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[590.23px] px-[4px] top-[5px]" data-name="Link">
      <p className="font-['Inter_Tight:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121212] text-[14px] tracking-[0.5838px] uppercase whitespace-nowrap">Fact Check</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2bee7770} id="Vector" stroke="var(--stroke-0, #121212)" strokeWidth="0.98" />
          <path d="M8.84998 9.34999L12 12.5" id="Vector_2" stroke="var(--stroke-0, #121212)" strokeWidth="0.98" />
        </g>
      </svg>
    </div>
  );
}

function TextInput() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-w-px relative" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter_Tight:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#121212] text-[12px] tracking-[0.24px] whitespace-nowrap">Search for topics</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[#faf9f6] content-stretch flex gap-[8px] h-[32px] items-center px-[11px] py-[6px] right-[-0.5px] rounded-[4px] top-[-1px] w-[320px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d9d7d2] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Icon />
      <TextInput />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[30px] relative shrink-0 w-[1130px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
        <Container3 />
        <div className="absolute h-0 left-[348px] top-[29px] w-[70px]">
          <div className="absolute inset-[-2px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70 2">
              <line id="Line 1" stroke="var(--stroke-0, #A16749)" strokeWidth="2" x2="70" y1="1" y2="1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center justify-between left-[132px] pb-[11px] pt-[10px] right-[132px] top-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#121212] border-b border-solid inset-0 pointer-events-none" />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#121212] content-stretch flex items-center justify-center overflow-clip px-[12px] py-[7px] relative rounded-[4px] shrink-0" data-name="Button">
      <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Sectors</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-center justify-center px-[12px] py-[7px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d9d7d2] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#1a1a1a] text-[12px] text-center whitespace-nowrap">Groups</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[32px] relative rounded-[4px] shrink-0 w-[88.25px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d9d7d2] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="-translate-x-1/2 absolute font-['Inter_Tight:Medium',sans-serif] leading-[18px] left-[44.5px] not-italic text-[#1a1a1a] text-[12px] text-center top-[7.5px] whitespace-nowrap">Employment</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[32px] relative rounded-[4px] shrink-0 w-[79.695px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d9d7d2] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="-translate-x-1/2 absolute font-['Inter_Tight:Medium',sans-serif] leading-[18px] left-[40px] not-italic text-[#1a1a1a] text-[12px] text-center top-[7.5px] whitespace-nowrap">Agriculture</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[6px_8px] items-start left-0 top-[61px] w-[1176px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function HealthiconsAgricultureOutline() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="healthicons:agriculture-outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="healthicons:agriculture-outline">
          <path d={svgPaths.p2c9931d0} fill="var(--fill-0, #383838)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel() {
  return (
    <div className="absolute h-[16px] left-0 top-[125px] w-[369px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">Agriculture</p>
      <HealthiconsAgricultureOutline />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[128px] left-0 overflow-clip top-[151px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container6 />
      <Container7 />
      <Container8 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-0 top-[125px]">
      <FigLabel />
      <Container5 />
    </div>
  );
}

function BoxiconsEducationFilled() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="boxicons:education-filled">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="boxicons:education-filled">
          <path d={svgPaths.p28e79080} fill="var(--fill-0, #383838)" id="Vector" />
          <path d={svgPaths.p28cce880} fill="var(--fill-0, #383838)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel1() {
  return (
    <div className="absolute h-[16px] left-[calc(50%+24px)] top-[125px] w-[369px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">Education</p>
      <BoxiconsEducationFilled />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[128px] left-[calc(50%+24px)] overflow-clip top-[151px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container10 />
      <Container11 />
      <Container12 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[calc(50%+24px)] top-[125px]">
      <FigLabel1 />
      <Container9 />
    </div>
  );
}

function BoxiconsEducationFilled1() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="boxicons:education-filled">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="boxicons:education-filled">
          <path d={svgPaths.p28e79080} fill="var(--fill-0, #383838)" id="Vector" />
          <path d={svgPaths.p28cce880} fill="var(--fill-0, #383838)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel2() {
  return (
    <div className="absolute h-[16px] left-0 top-[319px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">Employement</p>
      <BoxiconsEducationFilled1 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[128px] left-0 overflow-clip top-[345px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container14 />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-0 top-[319px]">
      <FigLabel2 />
      <Container13 />
    </div>
  );
}

function HealthiconsAgricultureOutline1() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="healthicons:agriculture-outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="healthicons:agriculture-outline">
          <path d={svgPaths.p2c9931d0} fill="var(--fill-0, #383838)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel3() {
  return (
    <div className="absolute h-[16px] left-[calc(50%+24px)] top-[319px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">Environment</p>
      <HealthiconsAgricultureOutline1 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[128px] left-[calc(50%+24px)] overflow-clip top-[345px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container18 />
      <Container19 />
      <Container20 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[calc(50%+24px)] top-[319px]">
      <FigLabel3 />
      <Container17 />
    </div>
  );
}

function BoxiconsEducationFilled2() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="boxicons:education-filled">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="boxicons:education-filled">
          <path d={svgPaths.p28e79080} fill="var(--fill-0, #383838)" id="Vector" />
          <path d={svgPaths.p28cce880} fill="var(--fill-0, #383838)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel4() {
  return (
    <div className="absolute h-[16px] left-0 top-[513px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">GOvernance</p>
      <BoxiconsEducationFilled2 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[128px] left-0 overflow-clip top-[539px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container22 />
      <Container23 />
      <Container24 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-0 top-[513px]">
      <FigLabel4 />
      <Container21 />
    </div>
  );
}

function BoxiconsEducationFilled3() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="boxicons:education-filled">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="boxicons:education-filled">
          <path d={svgPaths.p28e79080} fill="var(--fill-0, #383838)" id="Vector" />
          <path d={svgPaths.p28cce880} fill="var(--fill-0, #383838)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel5() {
  return (
    <div className="absolute h-[16px] left-[calc(50%+24px)] top-[513px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">Health</p>
      <BoxiconsEducationFilled3 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[128px] left-[calc(50%+24px)] overflow-clip top-[539px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container26 />
      <Container27 />
      <Container28 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[calc(50%+24px)] top-[513px]">
      <FigLabel5 />
      <Container25 />
    </div>
  );
}

function HealthiconsAgricultureOutline2() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="healthicons:agriculture-outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="healthicons:agriculture-outline">
          <path d={svgPaths.p2c9931d0} fill="var(--fill-0, #383838)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel6() {
  return (
    <div className="absolute h-[16px] left-0 top-[707px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">Housing</p>
      <HealthiconsAgricultureOutline2 />
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[128px] left-0 overflow-clip top-[733px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container30 />
      <Container31 />
      <Container32 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-0 top-[707px]">
      <FigLabel6 />
      <Container29 />
    </div>
  );
}

function BoxiconsEducationFilled4() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="boxicons:education-filled">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="boxicons:education-filled">
          <path d={svgPaths.p28e79080} fill="var(--fill-0, #383838)" id="Vector" />
          <path d={svgPaths.p28cce880} fill="var(--fill-0, #383838)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel7() {
  return (
    <div className="absolute h-[16px] left-[calc(50%+24px)] top-[707px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">{`Industry & Investment`}</p>
      <BoxiconsEducationFilled4 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute h-[128px] left-[calc(50%+24px)] overflow-clip top-[733px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container34 />
      <Container35 />
      <Container36 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[calc(50%+24px)] top-[707px]">
      <FigLabel7 />
      <Container33 />
    </div>
  );
}

function BoxiconsEducationFilled5() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="boxicons:education-filled">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="boxicons:education-filled">
          <path d={svgPaths.p28e79080} fill="var(--fill-0, #383838)" id="Vector" />
          <path d={svgPaths.p28cce880} fill="var(--fill-0, #383838)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel8() {
  return (
    <div className="absolute h-[16px] left-0 top-[901px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">Infrastructure</p>
      <BoxiconsEducationFilled5 />
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute h-[128px] left-0 overflow-clip top-[927px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container38 />
      <Container39 />
      <Container40 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-0 top-[901px]">
      <FigLabel8 />
      <Container37 />
    </div>
  );
}

function HealthiconsAgricultureOutline3() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="healthicons:agriculture-outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="healthicons:agriculture-outline">
          <path d={svgPaths.p2c9931d0} fill="var(--fill-0, #383838)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel9() {
  return (
    <div className="absolute h-[16px] left-[calc(50%+24px)] top-[901px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">{`Law & order`}</p>
      <HealthiconsAgricultureOutline3 />
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[12px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[128px] left-[calc(50%+24px)] overflow-clip top-[927px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container42 />
      <Container43 />
      <Container44 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[calc(50%+24px)] top-[901px]">
      <FigLabel9 />
      <Container41 />
    </div>
  );
}

function BoxiconsEducationFilled6() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="boxicons:education-filled">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="boxicons:education-filled">
          <path d={svgPaths.p28e79080} fill="var(--fill-0, #383838)" id="Vector" />
          <path d={svgPaths.p28cce880} fill="var(--fill-0, #383838)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel10() {
  return (
    <div className="absolute h-[16px] left-[calc(50%+24px)] top-[1095px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">{`Welfare & Cash Transfer`}</p>
      <BoxiconsEducationFilled6 />
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[10.5px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[10.5px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[10.5px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute h-[128px] left-[calc(50%+24px)] overflow-clip top-[1121px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container46 />
      <Container47 />
      <Container48 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[calc(50%+24px)] top-[1095px]">
      <FigLabel10 />
      <Container45 />
    </div>
  );
}

function BoxiconsEducationFilled7() {
  return (
    <div className="absolute left-0 size-[18px] top-[-2px]" data-name="boxicons:education-filled">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="boxicons:education-filled">
          <path d={svgPaths.p28e79080} fill="var(--fill-0, #383838)" id="Vector" />
          <path d={svgPaths.p28cce880} fill="var(--fill-0, #383838)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function FigLabel11() {
  return (
    <div className="absolute h-[16px] left-[3px] top-[1095px] w-[564px]" data-name="FigLabel">
      <p className="absolute font-['Inter_Tight:SemiBold',sans-serif] leading-[15.75px] left-[24px] not-italic text-[#121212] text-[12px] top-0 tracking-[1.2px] uppercase whitespace-nowrap">Transport</p>
      <BoxiconsEducationFilled7 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-0 top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">ADMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[10.5px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute bg-[#f6f1e9] border-[#a98c75] border-solid border-t-2 h-[128px] left-[188px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">DMK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[10.5px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute bg-[#faf9f6] border-[#a98c75] border-solid border-t-2 h-[128px] left-[376px] top-0 w-[188px]" data-name="Container">
      <p className="absolute font-['Inter_Tight:Bold',sans-serif] leading-[18px] left-[16px] not-italic text-[#a16749] text-[13px] top-[18px] tracking-[1.3523px] uppercase">TVK</p>
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[44px] left-[16px] text-[#121212] text-[38px] top-[44px]">18</p>
      <p className="absolute font-['IBM_Plex_Mono:Regular',sans-serif] leading-[15.75px] left-[16px] not-italic text-[#121212] text-[10.5px] top-[90px]">6.1% of 297</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute h-[128px] left-[3px] overflow-clip top-[1121px] w-[564px] whitespace-nowrap" data-name="Container">
      <Container50 />
      <Container51 />
      <Container52 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[3px] top-[1095px]">
      <FigLabel11 />
      <Container49 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[1179px] left-[132px] overflow-clip top-[53px] w-[1176px]">
      <p className="absolute font-['Source_Serif_4:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#121212] text-[24px] top-[16px] w-[586px]">Compare promises by</p>
      <Container4 />
      <Group />
      <Group1 />
      <Group2 />
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
      <Group11 />
      <Group10 />
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="bg-white relative size-full" data-name="Desktop - 3">
      <Container />
      <Frame />
    </div>
  );
}