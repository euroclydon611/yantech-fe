import { FaMedal, FaTools } from "react-icons/fa";
import { formatDateMonthYear } from "../../utils/helperFunction";
import { HiAcademicCap } from "react-icons/hi2";
import { GiSkills } from "react-icons/gi";

const Qualifications = ({ employee }: any) => {
  return (
    <>
      <section className="w-full p-2 rounded-md">
        <h3 className="font-bold text-xl">
          {employee?.firstname + " " + employee?.lastname} Qualifications
        </h3>
        <div className="bg-white p-2">
          {/* academic qualification */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-lg sm:text-xl">Academic</p>
            </div>
            {/* map academic array */}
            {employee?.academic_qualifications &&
              employee.academic_qualifications.map((info: any, i: any) => (
                <div key={i} className="flex flex-wrap gap-2 mb-3">
                  <HiAcademicCap size={25} className="text-[#1E3A8A] mt-1.5" />
                  <div>
                    <p className="font-medium text-lg text-[#000000E6]">
                      {info.institution}
                    </p>
                    <p className="text-sm text-[#000000E6]">{info.name}</p>
                    <p className="text-sm text-[#000000E6]">
                      {info?.start_date && formatDateMonthYear(info.start_date)}
                      {info?.end_date &&
                        " - " + formatDateMonthYear(info.end_date)}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* professional qualification */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-lg sm:text-xl">Professional</p>
            </div>
            {employee?.professional_qualifications &&
              employee.professional_qualifications.map((info: any, i: any) => (
                <div key={i} className="flex flex-wrap gap-2 mb-3">
                  <FaMedal size={25} className="text-[#065F46] mt-1.5" />
                  <div>
                    <p className="font-medium text-lg text-[#000000E6]">
                      {info.institution}
                    </p>
                    <p className="text-sm text-[#000000E6]">{info.name}</p>
                    <p className="text-sm text-[#000000E6]">
                      {info?.start_date && formatDateMonthYear(info.start_date)}
                      {info?.end_date &&
                        " - " + formatDateMonthYear(info.end_date)}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* training qualification */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-lg sm:text-xl">Trainings</p>
            </div>
            {employee?.trainings &&
              employee.trainings.map((info: any, i: any) => (
                <div key={i} className="flex flex-wrap gap-2 mb-3">
                  <FaTools size={25} className="text-[#F97316] mt-1.5" />
                  <div>
                    <p className="font-medium text-lg text-[#000000E6]">
                      {info.body}
                    </p>
                    <p className="text-sm text-[#000000E6]">{info.name}</p>
                    <p className="text-sm text-[#000000E6]">
                      {info.certification}
                    </p>
                    <p className="text-sm text-[#000000E6]">
                      {info?.start_date &&
                        "Issued Date" +
                          " - " +
                          formatDateMonthYear(info.start_date)}
                    </p>
                    <p
                      className={`text-sm ${
                        info?.expires &&
                        info?.end_date &&
                        new Date(info.end_date) <= new Date()
                          ? "text-red-600 font-bold" // Red color for expired dates
                          : "text-[#000000E6]"
                      }`}
                    >
                      {info?.expires && info?.end_date
                        ? new Date(info.end_date) <= new Date()
                          ? "Expiry Date - " +
                            formatDateMonthYear(info.end_date) +
                            " (expired)"
                          : "Expiry Date - " +
                            formatDateMonthYear(info.end_date)
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* special skills */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-lg sm:text-xl">Special Skills</p>
            </div>
            {employee?.special_skills &&
              employee.special_skills.map((info: any, i: any) => (
                <div key={i} className="flex flex-wrap gap-2 mb-3">
                  <GiSkills size={25} className="text-[#7C3AED] mt-1.5" />
                  <div>
                    <p className="font-medium text-lg text-[#000000E6]">
                      {info.name}
                    </p>
                    <p className="text-sm text-[#000000E6]">
                      {info.proficiency_level}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Qualifications;
