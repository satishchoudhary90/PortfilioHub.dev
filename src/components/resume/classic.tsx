"use client";

import { formatDate } from "@/lib/utils";

interface ResumeProps {
  data: any;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
}

function EditableText({
  value,
  field,
  editable,
  onEdit,
  className,
  tag: Tag = "span",
}: {
  value: string;
  field: string;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
  className?: string;
  tag?: any;
}) {
  if (!value && !editable) return null;
  return (
    <Tag
      className={`${className || ""} ${editable ? "outline-none ring-1 ring-transparent hover:ring-indigo-400/50 focus:ring-indigo-500 rounded px-0.5 cursor-text" : ""}`}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={(e: any) =>
        editable && onEdit?.(field, e.currentTarget.textContent || "")
      }
    >
      {value || (editable ? "Click to edit" : "")}
    </Tag>
  );
}

export default function ClassicResume({ data, editable, onEdit }: ResumeProps) {
  if (!data) return null;

  return (
    <div className="w-full max-w-[794px] min-h-screen print:min-h-[1123px] mx-auto shadow-sm lg:shadow-2xl bg-white text-black p-4 sm:p-8 lg:p-12 font-serif">
      {/* Name — centered, uppercase, wide letter-spacing */}
      <div className="text-center">
        <div className="flex flex-col items-center gap-3">
          {data.image && (
            <img
              src={data.image}
              alt=""
              className="w-14 h-14 rounded-full object-cover border border-black/20 shadow-sm"
            />
          )}
          <h1
            className="text-2xl font-bold uppercase tracking-[0.3em]"
            style={{ letterSpacing: "0.35em" }}
          >
            <EditableText
              value={data.name}
              field="name"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </h1>
          {/* Double line under name */}
          <div className="flex justify-center gap-2 mt-2">
            <div className="w-16 h-px bg-black" />
            <div className="w-16 h-px bg-black" />
          </div>
          <p className="text-sm mt-3 text-black/80">
            <EditableText
              value={data.headline}
              field="headline"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </p>
        </div>
      </div>

      {/* Contact — centered below name */}
      <div className="text-center text-sm mt-4 mb-8 space-x-4">
        {[data.email, data.phone, data.location, data.website]
          .filter(Boolean)
          .map((item, i) => (
            <span key={i}>
              {item}
              {i <
              [data.email, data.phone, data.location, data.website].filter(
                Boolean,
              ).length -
                1
                ? " | "
                : ""}
            </span>
          ))}
      </div>

      <hr className="border-black border-t mb-6" />

      {/* Bio */}
      {(data.bio || editable) && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Summary
          </h2>
          <hr className="border-black border-t mb-3" />
          <p className="text-sm leading-relaxed">
            <EditableText
              value={data.bio}
              field="bio"
              editable={editable}
              onEdit={onEdit}
              tag="span"
            />
          </p>
          <hr className="border-black border-t mt-4" />
        </section>
      )}

      {/* Experience */}
      {data.experiences?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Experience
          </h2>
          <hr className="border-black border-t mb-3" />
          <div className="space-y-5">
            {data.experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{exp.position}</h3>
                  <span className="text-xs">
                    {formatDate(exp.startDate)} —{" "}
                    {exp.current
                      ? "Present"
                      : exp.endDate
                        ? formatDate(exp.endDate)
                        : ""}
                  </span>
                </div>
                <p className="text-sm">{exp.company}</p>
                {exp.description && (
                  <p className="text-sm mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          <hr className="border-black border-t mt-4" />
        </section>
      )}

      {/* Education */}
      {data.educations?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Education
          </h2>
          <hr className="border-black border-t mb-3" />
          <div className="space-y-5">
            {data.educations.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">
                    {edu.degree}
                    {edu.field ? `, ${edu.field}` : ""}
                  </h3>
                  <span className="text-xs">
                    {formatDate(edu.startDate)} —{" "}
                    {edu.current
                      ? "Present"
                      : edu.endDate
                        ? formatDate(edu.endDate)
                        : ""}
                  </span>
                </div>
                <p className="text-sm">{edu.institution}</p>
              </div>
            ))}
          </div>
          <hr className="border-black border-t mt-4" />
        </section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Projects
          </h2>
          <hr className="border-black border-t mb-3" />
          <div className="space-y-4">
            {data.projects.map((proj: any) => (
              <div key={proj.id}>
                <h3 className="font-semibold">{proj.title}</h3>
                {proj.description && (
                  <p className="text-sm mt-0.5">{proj.description}</p>
                )}
                {proj.techStack?.length > 0 && (
                  <p className="text-xs mt-0.5">{proj.techStack.join(" · ")}</p>
                )}
                <div className="flex flex-col gap-1 text-xs mt-1">
                  {proj.githubUrl && (
                    <div>
                      <span className="text-gray-600">GitHub: </span>
                      <a
                        href={proj.githubUrl}
                        className="hover:underline break-all"
                      >
                        {proj.githubUrl}
                      </a>
                    </div>
                  )}
                  {proj.liveUrl && (
                    <div>
                      <span className="text-gray-600">Live: </span>
                      <a
                        href={proj.liveUrl}
                        className="hover:underline break-all"
                      >
                        {proj.liveUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <hr className="border-black border-t mt-4" />
        </section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Skills
          </h2>
          <hr className="border-black border-t mb-3" />
          <p className="text-sm">
            {data.skills.map((skill: any, i: number) => (
              <span key={skill.id}>
                {skill.name}
                {i < data.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </p>
        </section>
      )}
    </div>
  );
}
